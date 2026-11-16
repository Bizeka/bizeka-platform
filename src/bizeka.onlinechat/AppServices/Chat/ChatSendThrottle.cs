using System.Globalization;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Serenity;

namespace Bizeka.OnlineChat.AppServices;

/// <summary>Per-user, per-process send limit. A multi-instance host needs a distributed limit in front of it.</summary>
public sealed class ChatSendThrottle(IMemoryCache cache, IOptions<OnlineChatSignalROptions> options) : IChatSendThrottle
{
    public bool TryAcquire(int userId)
    {
        var settings = options.Value;
        if (settings.MessagesPerWindow <= 0) return true;
        var key = "Bizeka.OnlineChat.Send." + userId.ToString(CultureInfo.InvariantCulture);
        return new Throttler(cache, key, TimeSpan.FromSeconds(Math.Max(1, settings.SendWindowSeconds)),
            settings.MessagesPerWindow).Check();
    }
}
