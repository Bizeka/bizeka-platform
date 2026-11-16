namespace Bizeka.OnlineChat;

public interface IOnlineChatClient
{
    Task ReceiveMessage(ChatMessageDto messageDto);
    Task MessagesRead(long[] messageIds, int readByUserId);
    Task MessageReactionChanged(long messageId, int userId, string emoji, bool added);
    Task UserPresenceChanged(int userId, string displayName, bool isOnline);
}
