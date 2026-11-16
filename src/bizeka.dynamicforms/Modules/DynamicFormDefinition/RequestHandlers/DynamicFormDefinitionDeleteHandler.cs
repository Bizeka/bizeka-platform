namespace Bizeka.DynamicForms;

public interface IDynamicFormDefinitionDeleteHandler : IDeleteHandlerAsync<DynamicFormDefinitionRow>
{
}

public class DynamicFormDefinitionDeleteHandler : DeleteRequestHandlerAsync<DynamicFormDefinitionRow>, IDynamicFormDefinitionDeleteHandler
{
    public DynamicFormDefinitionDeleteHandler(IRequestContext context)
        : base(context)
    {
    }
}
