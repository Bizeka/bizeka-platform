using Bizeka.Todo.AppServices;

namespace Bizeka.Todo;

public sealed class TaskItemSaveHandler(IRequestContext context, IEnumerable<ITaskItemSaveProcessor> processors,
    ITaskItemBllService rules) : SaveRequestHandlerAsync<TaskItemRow>(context)
{
    protected override async Task BeforeSaveAsync(CancellationToken cancellationToken = default)
    {
        await rules.ValidateAsync(Connection, Row, IsCreate ? null : Old, User, cancellationToken).ConfigureAwait(false);
        await base.BeforeSaveAsync(cancellationToken).ConfigureAwait(false);
        var saveContext = new TaskItemSaveContext(Row, IsCreate);
        foreach (var processor in processors)
            await processor.BeforeSaveAsync(saveContext, cancellationToken).ConfigureAwait(false);
    }

    protected override async Task AfterSaveAsync(CancellationToken cancellationToken = default)
    {
        await base.AfterSaveAsync(cancellationToken).ConfigureAwait(false);
        var status = await Connection.TryFirstAsync<TaskStatusRow>(q => q.Select(TaskStatusRow.Fields.IsCompleted)
            .Where(TaskStatusRow.Fields.Id == Row.TaskStatusId!.Value), cancellationToken).ConfigureAwait(false);
        var after = new TaskItemAfterSaveContext(UnitOfWork, Row, IsCreate, status?.IsCompleted == true);
        foreach (var processor in processors)
            await processor.AfterSaveAsync(after, cancellationToken).ConfigureAwait(false);
    }
}
