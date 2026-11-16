namespace Bizeka.OnlineChat;

public class OnlineChatSignalROptions
{
    public const string SectionKey = "OnlineChatSignalR";

    public bool UseRedisBackplane { get; set; } = false;
    public string RedisConnectionString { get; set; } = string.Empty;

    /// <summary>Messages a user may send within <see cref="SendWindowSeconds"/>; 0 disables the limit.</summary>
    public int MessagesPerWindow { get; set; } = 30;
    public int SendWindowSeconds { get; set; } = 60;
}
