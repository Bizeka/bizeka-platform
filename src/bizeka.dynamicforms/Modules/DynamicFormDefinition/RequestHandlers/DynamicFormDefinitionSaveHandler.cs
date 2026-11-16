namespace Bizeka.DynamicForms;

public interface IDynamicFormDefinitionSaveHandler : ISaveHandlerAsync<DynamicFormDefinitionRow>
{
}

public class DynamicFormDefinitionSaveHandler : SaveRequestHandlerAsync<DynamicFormDefinitionRow>, IDynamicFormDefinitionSaveHandler
{
    public DynamicFormDefinitionSaveHandler(IRequestContext context)
        : base(context)
    {
    }
}
