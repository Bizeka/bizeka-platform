using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260331_0610)]
public sealed class DefaultDB_20260331_0610_TaskAssignmentSemantics : Migration
{
    public override void Up()
    {
        if (!Schema.Table("TaskItems").Exists())
            return;

        if (!Schema.Table("TaskItems").Column("AssignedByUserId").Exists())
            Alter.Table("TaskItems").AddColumn("AssignedByUserId").AsInt32().Nullable();

        if (!Schema.Table("TaskAssignees").Exists())
        {
            Create.Table("TaskAssignees")
                .WithColumn("Id").AsInt32().Identity().PrimaryKey()
                .WithColumn("TaskItemId").AsInt32().NotNullable()
                .WithColumn("UserId").AsInt32().NotNullable();

            Create.Index("IX_TaskAssignees_TaskItemId_UserId")
                .OnTable("TaskAssignees")
                .OnColumn("TaskItemId").Ascending()
                .OnColumn("UserId").Ascending()
                .WithOptions().Unique();
        }

    }

    public override void Down()
    {
    }
}
