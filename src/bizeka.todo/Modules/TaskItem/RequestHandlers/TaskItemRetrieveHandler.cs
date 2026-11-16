namespace Bizeka.Todo;

public sealed class TaskItemRetrieveHandler(IRequestContext context) : RetrieveRequestHandlerAsync<TaskItemRow>(context)
{
    protected override async Task PrepareQueryAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.PrepareQueryAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(TaskVisibility.CriteriaFor(TaskVisibility.TryGetUserId(User)));
    }
}
