namespace Bizeka.DynamicForms;

public interface IDynamicFormDefinitionListHandler : IListHandlerAsync<DynamicFormDefinitionRow>
{
}

public class DynamicFormDefinitionListHandler : ListRequestHandlerAsync<DynamicFormDefinitionRow>, IDynamicFormDefinitionListHandler
{
    public DynamicFormDefinitionListHandler(IRequestContext context)
        : base(context)
    {
    }
}
