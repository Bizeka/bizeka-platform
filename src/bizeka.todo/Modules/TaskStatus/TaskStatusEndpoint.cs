namespace Bizeka.Todo;

[Route("Services/Todo/TaskStatus/[action]")]
[ConnectionKey(typeof(TaskStatusRow)), ServiceAuthorize(typeof(TaskStatusRow))]
public sealed class TaskStatusEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(TaskStatusRow))]
    public Task<SaveResponse> Create(IUnitOfWork uow, SaveRequest<TaskStatusRow> request, [FromServices] TaskStatusSaveHandler handler, CancellationToken cancellationToken = default)
        => handler.CreateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeUpdate(typeof(TaskStatusRow))]
    public Task<SaveResponse> Update(IUnitOfWork uow, SaveRequest<TaskStatusRow> request, [FromServices] TaskStatusSaveHandler handler, CancellationToken cancellationToken = default)
        => handler.UpdateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeDelete(typeof(TaskStatusRow))]
    public Task<DeleteResponse> Delete(IUnitOfWork uow, DeleteRequest request, [FromServices] TaskStatusDeleteHandler handler, CancellationToken cancellationToken = default)
        => handler.DeleteAsync(uow, request, cancellationToken);

    [HttpPost]
    public Task<RetrieveResponse<TaskStatusRow>> Retrieve(IDbConnection connection, RetrieveRequest request, [FromServices] TaskStatusRetrieveHandler handler, CancellationToken cancellationToken = default)
        => handler.RetrieveAsync(connection, request, cancellationToken);

    [HttpPost]
    public Task<ListResponse<TaskStatusRow>> List(IDbConnection connection, ListRequest request, [FromServices] TaskStatusListHandler handler, CancellationToken cancellationToken = default)
        => handler.ListAsync(connection, request, cancellationToken);
}
