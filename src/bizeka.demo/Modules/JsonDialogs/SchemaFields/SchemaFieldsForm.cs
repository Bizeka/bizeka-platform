namespace Bizeka.Demo;

/// <summary>
/// The fixed part of the sample dialog. Everything else comes from the schema in SchemaFieldsPage.
/// </summary>
[FormScript("Demo.JsonDialogs.SchemaFields")]
public class SchemaFieldsForm
{
    [DisplayName("Event name"), Required]
    public string? EventName { get; set; }

    [DisplayName("Organizer")]
    public string? Organizer { get; set; }
}
