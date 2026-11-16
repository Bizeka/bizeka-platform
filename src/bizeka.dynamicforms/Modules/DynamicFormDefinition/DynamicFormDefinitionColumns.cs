namespace Bizeka.DynamicForms;

[ColumnsScript("DynamicForms.DynamicFormDefinition")]
[BasedOnRow(typeof(DynamicFormDefinitionRow), CheckNames = true)]
public class DynamicFormDefinitionColumns
{
    [EditLink, Width(280)]
    public string? FormKey { get; set; }

    [Width(320)]
    public string? Description { get; set; }

    [Width(90)]
    public bool? IsActive { get; set; }
}
