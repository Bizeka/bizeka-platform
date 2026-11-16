using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20260330_2200)]
public class DefaultDB_20260330_2200_Initial : AutoReversingMigration
{
    public override void Up()
    {
        if (!Schema.Table("TaskPriorities").Exists())
        {
            Create.Table("TaskPriorities")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("SortOrder").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("Color").AsString(20).Nullable()
                .WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true);
        }

        if (!Schema.Table("TaskStatuses").Exists())
        {
            Create.Table("TaskStatuses")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Name").AsString(100).NotNullable()
                .WithColumn("SortOrder").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("Color").AsString(20).Nullable()
                .WithColumn("IsCompleted").AsBoolean().NotNullable().WithDefaultValue(false)
                .WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true);
        }

        if (!Schema.Table("TaskItems").Exists())
        {
            Create.Table("TaskItems")
                .WithColumn("Id").AsInt32().PrimaryKey().Identity()
                .WithColumn("Summary").AsString(200).NotNullable()
                .WithColumn("AssigneeText").AsString(100).Nullable()
                .WithColumn("ReferenceNo").AsString(50).Nullable()
                .WithColumn("TagsText").AsString(500).Nullable()
                .WithColumn("SortOrder").AsInt32().NotNullable().WithDefaultValue(0)
                .WithColumn("TaskPriorityId").AsInt32().Nullable().ForeignKey("FK_TaskItems_TaskPriorities", "TaskPriorities", "Id")
                .WithColumn("TaskStatusId").AsInt32().NotNullable().ForeignKey("FK_TaskItems_TaskStatuses", "TaskStatuses", "Id")
                .WithColumn("StartDate").AsDateTime().Nullable()
                .WithColumn("DueDate").AsDateTime().Nullable()
                .WithColumn("CompletedOn").AsDateTime().Nullable()
                .WithColumn("EstimatedMinutes").AsInt32().Nullable()
                .WithColumn("ActualMinutes").AsInt32().Nullable()
                .WithColumn("Notes").AsString(int.MaxValue).Nullable()
                .WithColumn("Color").AsString(20).Nullable()
                .WithColumn("InsertDate").AsDateTime().NotNullable().WithDefault(SystemMethods.CurrentUTCDateTime)
                .WithColumn("InsertUserId").AsInt32().Nullable()
                .WithColumn("UpdateDate").AsDateTime().Nullable()
                .WithColumn("UpdateUserId").AsInt32().Nullable();


        }
    }
}
