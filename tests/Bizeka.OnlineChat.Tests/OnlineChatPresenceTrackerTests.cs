using Bizeka.OnlineChat;

namespace Bizeka.OnlineChat.Tests;

public sealed class OnlineChatPresenceTrackerTests
{
    [Fact]
    public void SecondTabKeepsUserOnline()
    {
        var tracker = new OnlineChatPresenceTracker();
        Assert.True(tracker.Connect("42"));
        Assert.False(tracker.Connect("42"));
        Assert.False(tracker.Disconnect("42"));
        Assert.True(tracker.Disconnect("42"));
        Assert.False(tracker.Disconnect("42"));
    }

    [Fact]
    public void EmptyIdentifierIgnored()
    {
        var tracker = new OnlineChatPresenceTracker();
        Assert.False(tracker.Connect(null));
        Assert.False(tracker.Disconnect(""));
    }
}
