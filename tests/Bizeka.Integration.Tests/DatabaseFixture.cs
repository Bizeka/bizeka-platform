using System.Data.Common;
using System.Reflection;
using FluentMigrator.Runner;
using FluentMigrator.Runner.Initialization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Data.Sqlite;
using Microsoft.Data.SqlClient;
using MySqlConnector;
using Npgsql;
using Serenity.Data;

namespace Bizeka.Integration.Tests;

public sealed class DatabaseFixture : IDisposable
{
    private readonly string provider;
    private readonly string name = "plat_test_" + Guid.NewGuid().ToString("N");
    private readonly string admin;
    private readonly ServiceProvider services;
    public WrappedConnection Connection { get; }
    public string ConnectionString { get; }
    public ISqlDialect Dialect { get; }

    /// <summary>Default migrations of the given module assemblies; Todo, OnlineChat and DynamicForms when none.</summary>
    public DatabaseFixture(string provider, params Assembly[] modules)
    {
        this.provider = provider;
        if (modules.Length == 0)
            modules = [typeof(Todo.TaskItemRow).Assembly, typeof(OnlineChat.ChatRoomRow).Assembly,
                typeof(DynamicForms.DynamicFormDefinitionRow).Assembly];
        admin = provider switch
        {
            "Postgres" => Environment.GetEnvironmentVariable("BIZEKA_PLATFORM_PG") ??
                "Host=127.0.0.1;Port=5472;Username=bizeka;Database=postgres;Pooling=false",
            "SqlServer" => Environment.GetEnvironmentVariable("BIZEKA_PLATFORM_SQL") ??
                "Server=.\\SQLEXPRESS;Database=master;Integrated Security=true;TrustServerCertificate=true;Pooling=false",
            "MySql" => Environment.GetEnvironmentVariable("BIZEKA_PLATFORM_MYSQL") ?? throw new InvalidOperationException("MySQL test connection required"),
            _ => "Data Source=" + Path.Combine(Path.GetTempPath(), name + ".db")
        };
        var connectionString = admin;
        ISqlDialect dialect = SqliteDialect.Instance;
        if (provider != "Sqlite")
        {
            using var control = Open(admin);
            using var command = control.CreateCommand();
            command.CommandText = "CREATE DATABASE " + name;
            command.ExecuteNonQuery();
            var builder = new DbConnectionStringBuilder { ConnectionString = admin };
            builder["Database"] = name;
            connectionString = builder.ConnectionString;
            dialect = provider switch { "Postgres" => PostgresDialect.Instance, "MySql" => MySqlDialect.Instance,
                _ => SqlServer2012Dialect.Instance };
        }
        services = new ServiceCollection().AddFluentMigratorCore().ConfigureRunner(r =>
        {
            if (provider == "Postgres") r.AddPostgres();
            else if (provider == "SqlServer") r.AddSqlServer2012();
            else if (provider == "MySql") r.AddMySql5();
            else r.AddSQLite();
            r.WithGlobalConnectionString(connectionString).ScanIn(modules).For.Migrations();
        }).Configure<RunnerOptions>(o => o.Tags = ["DefaultDB"]).BuildServiceProvider();
        ConnectionString = connectionString;
        Dialect = dialect;
        try
        {
            var runner = services.GetRequiredService<IMigrationRunner>();
            runner.MigrateUp();
            runner.MigrateUp(); // Re-running an installed migration set must be a no-op.
            Connection = new WrappedConnection(Open(connectionString), dialect);
            Connection.Execute("CREATE TABLE [Users] ([UserId] INT PRIMARY KEY, [Username] VARCHAR(100), [DisplayName] VARCHAR(100), [UserImage] VARCHAR(100))");
        }
        catch
        {
            Connection?.Dispose();
            services.Dispose();
            DropDatabase();
            throw;
        }
    }

    public DbConnection Open(string text)
    {
        DbConnection connection = provider switch { "Postgres" => new NpgsqlConnection(text), "SqlServer" => new SqlConnection(text),
            "MySql" => new MySqlConnection(text), _ => new SqliteConnection(text) };
        connection.Open();
        return connection;
    }

    public void Dispose()
    {
        Connection.Dispose();
        services.Dispose();
        DropDatabase();
    }

    private void DropDatabase()
    {
        if (provider == "Sqlite") { SqliteConnection.ClearAllPools(); File.Delete(Path.Combine(Path.GetTempPath(), name + ".db")); return; }
        using var control = Open(admin);
        using var command = control.CreateCommand();
        command.CommandText = "DROP DATABASE " + name;
        command.ExecuteNonQuery();
    }
}
