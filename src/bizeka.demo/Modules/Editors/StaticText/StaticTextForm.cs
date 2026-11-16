// Serenity.Extensions has an attribute of the same name; this sample uses the Bizeka one.
using StaticTextBlockAttribute = Bizeka.Extensions.StaticTextBlockAttribute;

namespace Bizeka.Demo;

[FormScript("Demo.Editors.StaticText")]
public class StaticTextForm
{
    [DisplayName("Instructions")]
    [StaticTextBlock(IsLocalText = true, Text = "Site.Demo.StaticText.Instructions")]
    public string? Instructions { get; set; }

    [DisplayName("Request title"), Required]
    public string? RequestTitle { get; set; }

    [DisplayName("Checklist")]
    [StaticTextBlock(IsHtml = true, IsLocalText = true, Text = "Site.Demo.StaticText.Checklist")]
    public string? Checklist { get; set; }

    [DisplayName("From a local text")]
    [StaticTextBlock(IsLocalText = true, Text = "Site.Extensions.DynamicFieldsTab")]
    public string? FromLocalText { get; set; }

    [DisplayName("Last reviewed")]
    [StaticTextBlock(IsDate = true)]
    public string? LastReviewed { get; set; }

    [DisplayName("Reviewer note")]
    [StaticTextBlock(IsHtml = true)]
    public string? ReviewerNote { get; set; }
}
