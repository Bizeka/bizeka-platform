namespace Bizeka.DynamicForms;

[FormScript("DynamicForms.DynamicFormDefinition")]
[BasedOnRow(typeof(DynamicFormDefinitionRow), CheckNames = true)]
public class DynamicFormDefinitionForm
{
    public string? FormKey { get; set; }
    [DynamicFieldsEditor]
    public string? DefinitionJson { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
