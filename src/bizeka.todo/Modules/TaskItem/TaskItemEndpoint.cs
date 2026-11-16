using Microsoft.AspNetCore.Http;

namespace Bizeka.Todo;

[Route("Services/Todo/TaskItem/[action]")]
[ConnectionKey(typeof(TaskItemRow)), ServiceAuthorize(typeof(TaskItemRow))]
public sealed class TaskItemEndpoint : ServiceEndpoint
{
    [HttpPost, AuthorizeCreate(typeof(TaskItemRow))]
    public async Task<NextTaskItemSortOrderResponse> NextSortOrder(
        IDbConnection connection, [FromServices] Bizeka.Todo.AppServices.ITaskItemBllService rules,
        CancellationToken cancellationToken = default)
    {
        return new NextTaskItemSortOrderResponse
        {
            SortOrder = await rules.NextOrderAsync(connection, cancellationToken).ConfigureAwait(false)
        };
    }

    [HttpPost, AuthorizeCreate(typeof(TaskItemRow))]
    public Task<SaveResponse> Create(IUnitOfWork uow, SaveRequest<TaskItemRow> request,
        [FromServices] TaskItemSaveHandler handler, CancellationToken cancellationToken = default)
        => handler.CreateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeUpdate(typeof(TaskItemRow))]
    public Task<SaveResponse> Update(IUnitOfWork uow, SaveRequest<TaskItemRow> request,
        [FromServices] TaskItemSaveHandler handler, CancellationToken cancellationToken = default)
        => handler.UpdateAsync(uow, request, cancellationToken);

    [HttpPost, AuthorizeDelete(typeof(TaskItemRow))]
    public Task<DeleteResponse> Delete(IUnitOfWork uow, DeleteRequest request,
        [FromServices] TaskItemDeleteHandler handler, CancellationToken cancellationToken = default)
        => handler.DeleteAsync(uow, request, cancellationToken);

    [HttpPost]
    public Task<RetrieveResponse<TaskItemRow>> Retrieve(IDbConnection connection, RetrieveRequest request,
        [FromServices] TaskItemRetrieveHandler handler, CancellationToken cancellationToken = default)
        => handler.RetrieveAsync(connection, request, cancellationToken);

    [HttpPost]
    public Task<ListResponse<TaskItemRow>> List(
        IDbConnection connection,
        ListRequest request,
        [FromServices] ITaskItemListHandler handler,
        CancellationToken cancellationToken = default)
        => handler.ListAsync(connection, request, cancellationToken);
}
