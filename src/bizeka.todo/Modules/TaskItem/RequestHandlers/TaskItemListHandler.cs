namespace Bizeka.Todo;

public interface ITaskItemListHandler : IListHandlerAsync<TaskItemRow> { }

[RegisterTransient(typeof(ITaskItemListHandler))]
public sealed class TaskItemListHandler(IRequestContext context)
    : ListRequestHandlerAsync<TaskItemRow>(context), ITaskItemListHandler
{
    protected override async Task ApplyFiltersAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.ApplyFiltersAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(TaskVisibility.CriteriaFor(TaskVisibility.TryGetUserId(User)));
    }
}
