using System.Data;
using System.Security.Claims;
using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.Texts;

namespace Bizeka.OnlineChat.AppServices;

public sealed class ChatAccessService : IChatAccessService
{
    public BaseCriteria RoomsFor(ClaimsPrincipal? user) => RoomCriteria("T0", user);

    public BaseCriteria MessagesFor(ClaimsPrincipal? user) => Criteria.Exists(new SqlQuery()
        .From("ChatRooms", new Alias("r")).Select("1")
        .Where(new Criteria("r.[Id]") == new Criteria("T0.[RoomId]") & RoomCriteria("r", user)));

    public async Task DemandAsync(IDbConnection connection, int roomId, ClaimsPrincipal? user,
        CancellationToken cancellationToken)
    {
        if (!await connection.ExistsAsync<ChatRoomRow>(ChatRoomRow.Fields.Id == roomId & RoomsFor(user),
            cancellationToken).ConfigureAwait(false)) throw new ValidationError(ChatValidationTexts.AccessDenied.Key);
    }

    private static BaseCriteria RoomCriteria(string alias, ClaimsPrincipal? user)
    {
        if (user?.Identity?.IsAuthenticated != true || !int.TryParse(user?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            out var id) || id <= 0) return new Criteria(alias + ".[Id] = -1");
        // A parameterless correlated expression avoids collisions with the caller's query parameters.
        var members = Criteria.Exists("SELECT 1 FROM [ChatRoomMembers] m WHERE m.[RoomId] = " + alias +
            ".[Id] AND m.[IsActive] = 1 AND m.[UserId] = " + id.ToString(System.Globalization.CultureInfo.InvariantCulture));
        return new Criteria(alias + ".[IsActive] = 1") &
            (new Criteria(alias + ".[RoomType] = 3") | new Criteria(alias + ".[InsertUserId] = " + id.ToString(System.Globalization.CultureInfo.InvariantCulture)) |
                members);
    }
}
