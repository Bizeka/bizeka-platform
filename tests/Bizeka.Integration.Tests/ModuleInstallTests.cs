using System.Reflection;
using Bizeka.DynamicForms;
using FluentMigrator;
using Moq;
using Serenity.Data;
using Xunit;

namespace Bizeka.Integration.Tests;

public sealed class ModuleInstallTests
{
    private const string DemoFormKey = "Northwind.Customer.OpenSource";
    private static readonly Assembly Todo = typeof(Todo.TaskItemRow).Assembly;
    private static readonly Assembly Chat = typeof(OnlineChat.ChatRoomRow).Assembly;
    private static readonly Assembly Forms = typeof(DynamicFormDefinitionRow).Assembly;
    private static readonly Assembly Demo = typeof(Demo.DemoSamplesPage).Assembly;

    public static IEnumerable<object[]> ProviderModules() =>
        from provider in AccessDataTests.Providers().Select(x => (string)x[0])
        from module in new[] { "Todo", "OnlineChat", "DynamicForms" }
        select new object[] { provider, module };

    [Theory]
    [MemberData(nameof(ProviderModules))]
    public async Task ModuleInstallsAlone(string provider, string module)
    {
        // Each module installs on an empty database without the others; the fixture runs its migrations twice.
        var assembly = module switch { "Todo" => Todo, "OnlineChat" => Chat, _ => Forms };
        using var fixture = new DatabaseFixture(provider, assembly);
        var ct = CancellationToken.None;
        var connection = fixture.Connection;
        if (module == "Todo") Assert.Equal(4, await connection.CountAsync<Todo.TaskStatusRow>(ct));
        else if (module == "OnlineChat") Assert.Equal(1, await connection.CountAsync<OnlineChat.ChatRoomRow>(ct));
        else Assert.Equal(0, await connection.CountAsync<DynamicFormDefinitionRow>(ct));
    }

    [Theory]
    [MemberData(nameof(AccessDataTests.Providers), MemberType = typeof(AccessDataTests))]
    public async Task DemoDataOnlyFromDemo(string provider)
    {
        var ct = CancellationToken.None;
        using (var product = new DatabaseFixture(provider, Forms, Todo))
            Assert.False(await product.Connection.ExistsAsync<DynamicFormDefinitionRow>(
                DynamicFormDefinitionRow.Fields.FormKey == DemoFormKey, ct));
        using var demo = new DatabaseFixture(provider, Forms, Demo);
        Assert.True(await demo.Connection.ExistsAsync<DynamicFormDefinitionRow>(
            DynamicFormDefinitionRow.Fields.FormKey == DemoFormKey, ct));
    }

    [Fact]
    public void MigrationVersionsUnique()
    {
        // All modules share the host's VersionInfo table, so a version may appear only once across assemblies.
        var duplicates = new[] { Todo, Chat, Forms, Demo }
            .SelectMany(a => a.GetTypes())
            .Select(t => (Type: t, Attribute: t.GetCustomAttribute<MigrationAttribute>()))
            .Where(x => x.Attribute != null)
            .GroupBy(x => x.Attribute!.Version)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key + ": " + string.Join(", ", g.Select(x => x.Type.FullName)))
            .ToList();
        Assert.Empty(duplicates);
    }

    [Theory]
    [MemberData(nameof(AccessDataTests.Providers), MemberType = typeof(AccessDataTests))]
    public async Task LookupSkipsInactive(string provider)
    {
        using var fixture = new DatabaseFixture(provider, Forms, Todo);
        await fixture.Connection.InsertAsync(new DynamicFormDefinitionRow
        {
            FormKey = "Inactive.Form", DefinitionJson = "[]", IsActive = false
        }, CancellationToken.None);
        var connections = new Mock<ISqlConnections>();
        connections.Setup(x => x.NewByKey("Default"))
            .Returns(() => new WrappedConnection(fixture.Open(fixture.ConnectionString), fixture.Dialect));

        var script = new DynamicFormDefinitionLookup(connections.Object).GetScript();

        Assert.Contains("Todo.TaskItem", script, StringComparison.Ordinal);
        Assert.DoesNotContain("Inactive.Form", script, StringComparison.Ordinal);
    }
}
