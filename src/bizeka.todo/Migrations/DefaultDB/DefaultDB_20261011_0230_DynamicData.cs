using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.Todo.Migrations.DefaultDB;

[Tags("DefaultDB"), Migration(20261011_0230)]
public class DefaultDB_20261011_0230_DynamicData : Migration
{
    public override void Up()
    {
        if (Schema.Table("TaskItems").Exists() && !Schema.Table("TaskItems").Column("DynamicDataJson").Exists())
        {
            Alter.Table("TaskItems").AddColumn("DynamicDataJson").AsString(int.MaxValue).Nullable();
        }

        // Seed DynamicFormDefinition for Todo.TaskItem
        if (Schema.Table("DynamicFormDefinitions").Exists())
        {
            var definitionJson = @"[
                {""__id"":""1"", ""Name"": ""StoryPoints"", ""Caption"": ""Story Points"", ""Type"": ""2"", ""Required"": true},
                {""__id"":""2"", ""Name"": ""EpicName"", ""Caption"": ""Epic Name"", ""Type"": ""1""},
                {""__id"":""3"", ""Name"": ""IsBlocker"", ""Caption"": ""Is Blocker?"", ""Type"": ""5""}
            ]";

            Delete.FromTable("DynamicFormDefinitions").Row(new { FormKey = "Todo.TaskItem" });
            Insert.IntoTable("DynamicFormDefinitions").Row(new {
                FormKey = "Todo.TaskItem",
                DefinitionJson = definitionJson,
                Description = "Todo Module Dynamic Fields",
                IsActive = true
            });
        }
    }

    public override void Down()
    {
    }
}
