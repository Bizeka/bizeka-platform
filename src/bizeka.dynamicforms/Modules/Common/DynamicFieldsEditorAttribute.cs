namespace Bizeka.DynamicForms;

public class DynamicFieldsEditorAttribute : CustomEditorAttribute
{
    public const string Key = "Bizeka.DynamicForms.DynamicFieldsEditor";

    public DynamicFieldsEditorAttribute()
        : base(Key)
    {
    }
}
