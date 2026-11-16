using FluentMigrator;

namespace Bizeka.Demo.Migrations.DefaultDB;

[Tags("DefaultDB")]
[Migration(20261022_1200)]
public class DefaultDB_20261022_1200_NorthwindCustomerDemoDefinition : Migration
{
    public override void Up()
    {
        Insert.IntoTable("DynamicFormDefinitions").Row(new
        {
            FormKey = "Northwind.Customer.OpenSource",
            DefinitionJson = """
[
                        {"Name":"AccountManagerCode","Caption":"Account Manager Code","Type":"1","Required":false,"MaxLength":30,"Placeholder":"Internal reference for customer ownership","Tab":"Bizeka OSS"},
                        {"Name":"TargetRevenue","Caption":"Target Revenue","Type":"3","Required":false,"MinValue":"0","MaxValue":"10000000","DecimalDigits":2,"Placeholder":"Expected annual revenue","Tab":"Bizeka OSS"},
                        {"Name":"OnboardingDate","Caption":"Onboarding Date","Type":"4","Required":false,"Tab":"Bizeka OSS"},
                        {"Name":"RenewalReviewAt","Caption":"Renewal Review At","Type":"8","Required":false,"Tab":"Bizeka OSS"},
                        {"Name":"SuccessNotes","Caption":"Success Notes","Type":"7","Required":false,"TextRows":5,"MaxLength":1500,"Placeholder":"What should the team know about this customer?","Tab":"Bizeka OSS"}
                    ]
""",
            Description = "Open source showcase definition for Northwind.Customer",
            IsActive = true
        });
    }

    public override void Down()
    {
        Delete.FromTable("DynamicFormDefinitions").Row(new { FormKey = "Northwind.Customer.OpenSource" });
    }
}
