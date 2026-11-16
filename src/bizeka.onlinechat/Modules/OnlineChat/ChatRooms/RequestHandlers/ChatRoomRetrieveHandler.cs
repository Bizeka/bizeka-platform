using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatRoomRetrieveHandler : IRetrieveHandlerAsync<ChatRoomRow> { }

[RegisterScoped(typeof(IChatRoomRetrieveHandler))]
public sealed class ChatRoomRetrieveHandler(IRequestContext context, IChatAccessService access)
    : RetrieveRequestHandlerAsync<ChatRoomRow>(context), IChatRoomRetrieveHandler
{
    protected override async Task PrepareQueryAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.PrepareQueryAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.RoomsFor(User));
    }
}
