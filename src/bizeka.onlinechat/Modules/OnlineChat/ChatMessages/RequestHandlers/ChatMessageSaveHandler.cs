using Serenity.Services;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

public interface IChatMessageSaveHandler : ISaveHandlerAsync<ChatMessageRow> { }

[RegisterScoped(typeof(IChatMessageSaveHandler))]
public sealed class ChatMessageSaveHandler(IRequestContext context, IChatMessageBllService rules)
    : SaveRequestHandlerAsync<ChatMessageRow>(context), IChatMessageSaveHandler
{
    protected override async Task BeforeSaveAsync(CancellationToken cancellationToken = default)
    {
        await rules.ValidateAsync(Connection, Row, IsCreate ? null : Old, User, cancellationToken).ConfigureAwait(false);
        await base.BeforeSaveAsync(cancellationToken).ConfigureAwait(false);
    }
}
