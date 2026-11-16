using System.Data;
using System.Security.Claims;
using Serenity.Data;

namespace Bizeka.OnlineChat.AppServices;

public interface IChatAccessService
{
    BaseCriteria RoomsFor(ClaimsPrincipal? user);
    BaseCriteria MessagesFor(ClaimsPrincipal? user);
    Task DemandAsync(IDbConnection connection, int roomId, ClaimsPrincipal? user, CancellationToken cancellationToken);
}
