using System.Data;
using System.Security.Claims;

namespace Bizeka.Todo.AppServices;

public interface ITaskItemBllService
{
    Task<int> NextOrderAsync(IDbConnection connection, CancellationToken cancellationToken);
    Task ValidateAsync(IDbConnection connection, TaskItemRow row, TaskItemRow? old, ClaimsPrincipal? user,
        CancellationToken cancellationToken);
}
