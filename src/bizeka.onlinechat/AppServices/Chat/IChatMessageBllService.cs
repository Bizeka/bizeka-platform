using System.Data;
using System.Security.Claims;

namespace Bizeka.OnlineChat.AppServices;

public interface IChatMessageBllService
{
    Task ValidateAsync(IDbConnection connection, ChatMessageRow row, ChatMessageRow? old,
        ClaimsPrincipal? user, CancellationToken cancellationToken);
    Task NotifyAsync(IDbConnection connection, long messageId, CancellationToken cancellationToken);
}
