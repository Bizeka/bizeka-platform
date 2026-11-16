namespace Bizeka.OnlineChat;

public interface IChatBroadcaster
{
    Task BroadcastMessageAsync(ChatMessageDto message, string[] recipients, bool general,
        CancellationToken cancellationToken);
}
