using Bizeka.Extensions;

namespace Bizeka.Demo;

[FormScript("Demo.Editors.ChoiceEditors")]
public class ChoiceEditorsForm
{
    [DisplayName("Send weekly summary"), BooleanSwitchEditor]
    public bool SendSummary { get; set; }

    [DisplayName("Visible to customers"), YesNoEditor]
    public bool? CustomerVisible { get; set; }

    [DisplayName("Delivery days"), CheckboxButtonEditor(EnumKey = "Demo.DeliveryDay")]
    public string? DeliveryDays { get; set; }
}
