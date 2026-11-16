using FluentMigrator;

namespace Bizeka.DynamicForms.Migrations.DefaultDB;

[Tags("DefaultDB")]
[Migration(20260330_1000)]
public class DefaultDB_20260330_1000_DynamicFormsInitial : Migration
{
    public override void Up()
    {
        if (!Schema.Table("DynamicFormDefinitions").Exists())
        {
            Create.Table("DynamicFormDefinitions")
                .WithColumn("Id").AsInt32().Identity().PrimaryKey().NotNullable()
                .WithColumn("FormKey").AsString(150).NotNullable()
                .WithColumn("DefinitionJson").AsString(int.MaxValue).Nullable()
                .WithColumn("Description").AsString(500).Nullable()
                .WithColumn("IsActive").AsBoolean().NotNullable().WithDefaultValue(true);
        }


    }

    public override void Down()
    {
        if (Schema.Table("DynamicFormDefinitions").Exists())
            Delete.Table("DynamicFormDefinitions");
    }
}
