using Microsoft.AspNetCore.SignalR;

namespace Bizeka.OnlineChat;

public sealed class ChatBroadcaster(IHubContext<ChatHub, IOnlineChatClient> hubContext) : IChatBroadcaster
{
    public async Task BroadcastMessageAsync(ChatMessageDto message, string[] recipients, bool general,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        if (general) await hubContext.Clients.Group("General").ReceiveMessage(message).ConfigureAwait(false);
        else await hubContext.Clients.Users(recipients).ReceiveMessage(message).ConfigureAwait(false);
    }
}
