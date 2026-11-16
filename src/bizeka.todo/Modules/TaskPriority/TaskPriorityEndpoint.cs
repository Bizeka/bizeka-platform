namespace Bizeka.Todo;

[Route("Services/Todo/TaskPriority/[action]")]
[ConnectionKey(typeof(TaskPriorityRow)), ServiceAuthorize(typeof(TaskPriorityRow))]
public sealed class TaskPriorityEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(TaskPriorityRow))]
    public Task<SaveResponse> Create(IUnitOfWork uow, SaveRequest<TaskPriorityRow> request, [FromServices] TaskPrioritySaveHandler handler, CancellationToken cancellationToken = default)
        => handler.CreateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeUpdate(typeof(TaskPriorityRow))]
    public Task<SaveResponse> Update(IUnitOfWork uow, SaveRequest<TaskPriorityRow> request, [FromServices] TaskPrioritySaveHandler handler, CancellationToken cancellationToken = default)
        => handler.UpdateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeDelete(typeof(TaskPriorityRow))]
    public Task<DeleteResponse> Delete(IUnitOfWork uow, DeleteRequest request, [FromServices] TaskPriorityDeleteHandler handler, CancellationToken cancellationToken = default)
        => handler.DeleteAsync(uow, request, cancellationToken);

    [HttpPost]
    public Task<RetrieveResponse<TaskPriorityRow>> Retrieve(IDbConnection connection, RetrieveRequest request, [FromServices] TaskPriorityRetrieveHandler handler, CancellationToken cancellationToken = default)
        => handler.RetrieveAsync(connection, request, cancellationToken);

    [HttpPost]
    public Task<ListResponse<TaskPriorityRow>> List(IDbConnection connection, ListRequest request, [FromServices] TaskPriorityListHandler handler, CancellationToken cancellationToken = default)
        => handler.ListAsync(connection, request, cancellationToken);
}
