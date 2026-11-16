namespace Bizeka.OnlineChat.AppServices;

public interface IChatSendThrottle
{
    /// <summary>Counts one message for the user and returns false when the configured rate is exceeded.</summary>
    bool TryAcquire(int userId);
}
