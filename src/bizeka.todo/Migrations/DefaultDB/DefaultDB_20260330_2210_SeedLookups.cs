using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260330_2210)]
public class DefaultDB_20260330_2210_SeedLookups : Migration
{
    public override void Up()
    {
        Insert.IntoTable("TaskPriorities").Row(new { Name = "Low", SortOrder = 10, Color = "#6c757d", IsActive = true });
        Insert.IntoTable("TaskPriorities").Row(new { Name = "Normal", SortOrder = 20, Color = "#0d6efd", IsActive = true });
        Insert.IntoTable("TaskPriorities").Row(new { Name = "High", SortOrder = 30, Color = "#dc3545", IsActive = true });
        Insert.IntoTable("TaskStatuses").Row(new { Name = "New", SortOrder = 10, Color = "#0d6efd", IsActive = true, IsCompleted = false });
        Insert.IntoTable("TaskStatuses").Row(new { Name = "In Progress", SortOrder = 20, Color = "#17a2b8", IsActive = true, IsCompleted = false });
        Insert.IntoTable("TaskStatuses").Row(new { Name = "Blocked", SortOrder = 30, Color = "#ffc107", IsActive = true, IsCompleted = false });
        Insert.IntoTable("TaskStatuses").Row(new { Name = "Completed", SortOrder = 40, Color = "#198754", IsActive = true, IsCompleted = true });
    }

    public override void Down()
    {
    }
}
