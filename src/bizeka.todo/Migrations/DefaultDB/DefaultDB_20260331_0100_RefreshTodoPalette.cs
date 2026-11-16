using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260331_0100)]
public class DefaultDB_20260331_0100_RefreshTodoPalette : Migration
{
    public override void Up()
    {
        Update.Table("TaskPriorities").Set(new { Color = "#94a3b8" }).Where(new { Name = "Low" });
        Update.Table("TaskPriorities").Set(new { Color = "#2563eb" }).Where(new { Name = "Normal" });
        Update.Table("TaskPriorities").Set(new { Color = "#dc2626" }).Where(new { Name = "High" });
        Update.Table("TaskStatuses").Set(new { Color = "#2563eb" }).Where(new { Name = "New" });
        Update.Table("TaskStatuses").Set(new { Color = "#0f766e" }).Where(new { Name = "In Progress" });
        Update.Table("TaskStatuses").Set(new { Color = "#d97706" }).Where(new { Name = "Blocked" });
        Update.Table("TaskStatuses").Set(new { Color = "#16a34a" }).Where(new { Name = "Completed" });
    }

    public override void Down()
    {
    }
}
