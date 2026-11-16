using System.Data;
using System.Security.Claims;
using Bizeka.Todo.Texts;

namespace Bizeka.Todo.AppServices;

[RegisterScoped(typeof(ITaskItemBllService))]
public sealed class TaskItemBllService : ITaskItemBllService
{
    public async Task<int> NextOrderAsync(IDbConnection connection, CancellationToken cancellationToken)
    {
        var f = TaskItemRow.Fields;
        var row = await connection.TryFirstAsync<TaskItemRow>(q => q.Select(f.SortOrder)
            .OrderBy(f.SortOrder, desc: true), cancellationToken).ConfigureAwait(false);
        return checked(Math.Max(row?.SortOrder ?? 0, 0) + 10);
    }

    public async Task ValidateAsync(IDbConnection connection, TaskItemRow row, TaskItemRow? old,
        ClaimsPrincipal? user, CancellationToken cancellationToken)
    {
        var userId = TaskVisibility.TryGetUserId(user) ?? throw Denied();
        if (old is not null && !await connection.ExistsAsync<TaskItemRow>(TaskItemRow.Fields.Id == old.Id!.Value &
            TaskVisibility.CriteriaFor(userId), cancellationToken).ConfigureAwait(false)) throw Denied();
        if (row.StartDate.HasValue && row.DueDate < row.StartDate)
            throw new ValidationError(TodoValidationTexts.DateOrder.Key);
        if (row.EstimatedMinutes < 0 || row.ActualMinutes < 0)
            throw new ValidationError(TodoValidationTexts.NegativeMinutes.Key);
        row.AssignedByUserId = old is null ? userId : old.AssignedByUserId;
        row.SortOrder = old is null ? await NextOrderAsync(connection, cancellationToken).ConfigureAwait(false) : old.SortOrder;
        if (row.TaskStatusId is not > 0)
            throw new ValidationError(TodoValidationTexts.InvalidStatus.Key);
        var status = await connection.TryFirstAsync<TaskStatusRow>(q => q.Select(TaskStatusRow.Fields.IsCompleted)
            .Where(TaskStatusRow.Fields.Id == row.TaskStatusId.Value), cancellationToken).ConfigureAwait(false)
            ?? throw new ValidationError(TodoValidationTexts.InvalidStatus.Key);
        row.CompletedOn = status.IsCompleted == true ? (row.CompletedOn ?? DateTime.UtcNow).Date : null;
    }

    private static ValidationError Denied() => new(TodoValidationTexts.AccessDenied.Key);
}
