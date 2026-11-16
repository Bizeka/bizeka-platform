using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatMessageListHandler : IListHandlerAsync<ChatMessageRow> { }

[RegisterScoped(typeof(IChatMessageListHandler))]
public sealed class ChatMessageListHandler(IRequestContext context, IChatAccessService access)
    : ListRequestHandlerAsync<ChatMessageRow>(context), IChatMessageListHandler
{
    protected override async Task ApplyFiltersAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.ApplyFiltersAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.MessagesFor(User));
    }
}
