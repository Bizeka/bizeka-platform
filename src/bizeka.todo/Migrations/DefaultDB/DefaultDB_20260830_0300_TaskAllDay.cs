using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260830_0300)]
public class DefaultDB_20260830_0300_TaskAllDay : Migration
{
    public override void Up()
    {
        if (Schema.Table("TaskItems").Exists() &&
            !Schema.Table("TaskItems").Column("IsAllDay").Exists())
        {
            Alter.Table("TaskItems")
                .AddColumn("IsAllDay").AsBoolean().NotNullable().WithDefaultValue(false);
        }
    }

    public override void Down()
    {
    }
}
