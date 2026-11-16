using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatRoomDeleteHandler : IDeleteHandlerAsync<ChatRoomRow> { }

[RegisterScoped(typeof(IChatRoomDeleteHandler))]
public sealed class ChatRoomDeleteHandler(IRequestContext context, IChatAccessService access)
    : DeleteRequestHandlerAsync<ChatRoomRow>(context), IChatRoomDeleteHandler
{
    protected override async Task PrepareQueryAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.PrepareQueryAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.RoomsFor(User));
        query.Where(ChatRoomRow.Fields.InsertUserId == (int.TryParse(User?.GetIdentifier(), out var userId) ? userId : -1));
    }
}
