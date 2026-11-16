using Serenity.Data;

namespace Bizeka.Todo;

public interface ITaskItemSaveProcessor
{
    Task BeforeSaveAsync(TaskItemSaveContext context, CancellationToken cancellationToken = default);

    Task AfterSaveAsync(TaskItemAfterSaveContext context, CancellationToken cancellationToken = default);
}

public sealed record TaskItemSaveContext(TaskItemRow Row, bool IsCreate);

public sealed record TaskItemAfterSaveContext(
    IUnitOfWork UnitOfWork,
    TaskItemRow Row,
    bool IsCreate,
    bool IsCompleted);
