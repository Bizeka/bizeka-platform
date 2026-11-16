using Serenity;
using Serenity.ComponentModel;

namespace Bizeka.OnlineChat.Texts;

[NestedLocalTexts(Prefix = "Site.")]
public static class OnlinechatSiteTexts
{
    public static class OnlineChat
    {
        public static readonly LocalText Chats = "Chats";
        public static readonly LocalText OpenChat = "Open chat";
        public static readonly LocalText CloseChat = "Close chat";
        public static readonly LocalText PageTitle = "Bizeka Chat";
        public static readonly LocalText SearchPlaceholder = "Search people or rooms...";
        public static readonly LocalText ShowChatList = "Show chat list";
        public static readonly LocalText SelectChat = "Select a chat";
        public static readonly LocalText NoChats = "No chats found";
        public static readonly LocalText MessagePlaceholder = "Type a message...";
        public static readonly LocalText AttachFile = "Attach file";
        public static readonly LocalText SendMessage = "Send message";
        public static readonly LocalText TeamInbox = "Team inbox";
        public static readonly LocalText ChannelStatus = "Secure workspace channel";
        public static readonly LocalText Live = "Live";
        public static readonly LocalText EmptyTitle = "Start your conversation here";
        public static readonly LocalText EmptyDescription = "Start a new conversation in the secure workspace.";
        public static class Notifications
        {
            public static readonly LocalText NewMessage = "New message: {message}";
            public static readonly LocalText UserOnline = "{user} is online";
            public static readonly LocalText UserOffline = "{user} is offline";
            public static readonly LocalText RoomConnected = "Connected to {room} chat room.";
            public static readonly LocalText RoomConnectionFailed = "Could not connect to the chat room.";
        }
        public static class Errors
        {
            public static readonly LocalText MessageSendFailed = "Message could not be sent: {error}";
            public static readonly LocalText Unknown = "Unknown error";
        }
        public static readonly LocalText You = "You";
    }
}
