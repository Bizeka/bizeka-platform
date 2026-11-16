using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatMessageRetrieveHandler : IRetrieveHandlerAsync<ChatMessageRow> { }

[RegisterScoped(typeof(IChatMessageRetrieveHandler))]
public sealed class ChatMessageRetrieveHandler(IRequestContext context, IChatAccessService access)
    : RetrieveRequestHandlerAsync<ChatMessageRow>(context), IChatMessageRetrieveHandler
{
    protected override async Task PrepareQueryAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.PrepareQueryAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.MessagesFor(User));
    }
}
