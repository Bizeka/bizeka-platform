namespace Bizeka.DynamicForms;

[Route("Services/DynamicForms/DynamicFormDefinition/[action]")]
[ConnectionKey(typeof(DynamicFormDefinitionRow)), ServiceAuthorize(typeof(DynamicFormDefinitionRow))]
public class DynamicFormDefinitionEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(DynamicFormDefinitionRow))]
    public Task<SaveResponse> Create(IUnitOfWork uow, SaveRequest<DynamicFormDefinitionRow> request,
        [FromServices] IDynamicFormDefinitionSaveHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.CreateAsync(uow, request, cancellationToken);
    }

    [HttpPost, AuthorizeUpdate(typeof(DynamicFormDefinitionRow))]
    public Task<SaveResponse> Update(IUnitOfWork uow, SaveRequest<DynamicFormDefinitionRow> request,
        [FromServices] IDynamicFormDefinitionSaveHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.UpdateAsync(uow, request, cancellationToken);
    }

    [HttpPost, AuthorizeDelete(typeof(DynamicFormDefinitionRow))]
    public Task<DeleteResponse> Delete(IUnitOfWork uow, DeleteRequest request,
        [FromServices] IDynamicFormDefinitionDeleteHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.DeleteAsync(uow, request, cancellationToken);
    }

    [HttpPost]
    public Task<RetrieveResponse<DynamicFormDefinitionRow>> Retrieve(IDbConnection connection, RetrieveRequest request,
        [FromServices] IDynamicFormDefinitionRetrieveHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.RetrieveAsync(connection, request, cancellationToken);
    }

    [HttpPost]
    public Task<ListResponse<DynamicFormDefinitionRow>> List(IDbConnection connection, ListRequest request,
        [FromServices] IDynamicFormDefinitionListHandler handler, CancellationToken cancellationToken = default)
    {
        return handler.ListAsync(connection, request, cancellationToken);
    }
}
