using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatMessageDeleteHandler : IDeleteHandlerAsync<ChatMessageRow> { }

[RegisterScoped(typeof(IChatMessageDeleteHandler))]
public sealed class ChatMessageDeleteHandler(IRequestContext context, IChatAccessService access)
    : DeleteRequestHandlerAsync<ChatMessageRow>(context), IChatMessageDeleteHandler
{
    protected override async Task PrepareQueryAsync(SqlQuery query, CancellationToken cancellationToken = default)
    {
        await base.PrepareQueryAsync(query, cancellationToken).ConfigureAwait(false);
        query.Where(access.MessagesFor(User));
        query.Where(ChatMessageRow.Fields.SenderId == (int.TryParse(User?.GetIdentifier(), out var userId) ? userId : -1));
    }
}
