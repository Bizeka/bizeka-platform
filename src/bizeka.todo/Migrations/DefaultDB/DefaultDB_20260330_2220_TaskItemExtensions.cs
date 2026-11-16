using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260330_2220)]
public class DefaultDB_20260330_2220_TaskItemExtensions : Migration
{
    public override void Up()
    {
        if (!Schema.Table("TaskItems").Exists())
            return;

        if (!Schema.Table("TaskItems").Column("AssignedUserId").Exists())
            Alter.Table("TaskItems").AddColumn("AssignedUserId").AsInt32().Nullable();

        if (!Schema.Table("TaskItems").Column("AttachmentsJson").Exists())
            Alter.Table("TaskItems").AddColumn("AttachmentsJson").AsString(int.MaxValue).Nullable();
    }

    public override void Down()
    {
    }
}
