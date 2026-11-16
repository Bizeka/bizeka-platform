namespace Bizeka.OnlineChat;

public sealed class OnlineChatPresenceTracker
{
    private readonly object gate = new();
    private readonly Dictionary<string, int> connections = new();

    public bool Connect(string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return false;
        lock (gate)
        {
            connections.TryGetValue(userId, out var count);
            connections[userId] = count + 1;
            return count == 0;
        }
    }

    public bool Disconnect(string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return false;
        lock (gate)
        {
            if (!connections.TryGetValue(userId, out var count)) return false;
            if (count > 1) { connections[userId] = count - 1; return false; }
            connections.Remove(userId);
            return true;
        }
    }
}
