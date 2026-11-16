using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatRoomListHandler : IListHandlerAsync<ChatRoomRow> { }

[RegisterScoped(typeof(IChatRoomListHandler))]
public sealed class ChatRoomListHandler(IRequestContext context, IChatAccessService access)
    : ListRequestHandlerAsync<ChatRoomRow>(context), IChatRoomListHandler
{
    protected override async Task ApplyFiltersAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.ApplyFiltersAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.RoomsFor(User));
    }
}
