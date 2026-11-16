namespace Bizeka.DynamicForms;

public interface IDynamicFormDefinitionRetrieveHandler : IRetrieveHandlerAsync<DynamicFormDefinitionRow>
{
}

public class DynamicFormDefinitionRetrieveHandler : RetrieveRequestHandlerAsync<DynamicFormDefinitionRow>, IDynamicFormDefinitionRetrieveHandler
{
    public DynamicFormDefinitionRetrieveHandler(IRequestContext context)
        : base(context)
    {
    }
}
