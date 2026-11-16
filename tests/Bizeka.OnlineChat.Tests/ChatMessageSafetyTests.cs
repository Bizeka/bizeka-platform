using System.Security.Claims;
using Bizeka.OnlineChat;
using Bizeka.OnlineChat.AppServices;
using Bizeka.OnlineChat.Texts;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using Serenity.Data;
using Serenity.Services;

namespace Bizeka.OnlineChat.Tests;

public sealed class ChatMessageSafetyTests
{
    private static readonly ClaimsPrincipal Sender = new(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "5")], "Test"));

    [Fact]
    public void ClientCannotWriteFileUrl()
    {
        // Attachment URLs and delete stamps must never come from a client request.
        foreach (var field in new Field[] { ChatMessageRow.Fields.FileUrl, ChatMessageRow.Fields.DeleteUserId,
            ChatMessageRow.Fields.DeleteDate })
        {
            Assert.False(field.Flags.HasFlag(FieldFlags.Insertable), field.Name + " is insertable");
            Assert.False(field.Flags.HasFlag(FieldFlags.Updatable), field.Name + " is updatable");
        }
    }

    [Fact]
    public void ThrottleLimitsEachUser()
    {
        var throttle = Throttle(limit: 2);
        Assert.True(throttle.TryAcquire(1));
        Assert.True(throttle.TryAcquire(1));
        Assert.False(throttle.TryAcquire(1));
        Assert.True(throttle.TryAcquire(2));
        var unlimited = Throttle(limit: 0);
        Assert.All(Enumerable.Range(0, 50), _ => Assert.True(unlimited.TryAcquire(1)));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("   ")]
    public async Task BlankMessageIsRejected(string? text)
    {
        var access = new Mock<IChatAccessService>(MockBehavior.Strict);
        var rules = Rules(access.Object, Throttle(limit: 10));
        var error = await Assert.ThrowsAsync<ValidationError>(() => rules.ValidateAsync(null!,
            new ChatMessageRow { RoomId = 1, MessageText = text }, null, Sender, CancellationToken.None));
        Assert.Equal(ChatValidationTexts.InvalidMessage.Key, error.Message);
    }

    [Fact]
    public async Task FloodingSenderIsRejected()
    {
        var throttle = new Mock<IChatSendThrottle>();
        throttle.Setup(x => x.TryAcquire(5)).Returns(false);
        var rules = Rules(new Mock<IChatAccessService>(MockBehavior.Strict).Object, throttle.Object);
        var error = await Assert.ThrowsAsync<ValidationError>(() => rules.ValidateAsync(null!,
            new ChatMessageRow { RoomId = 1, MessageText = "hello" }, null, Sender, CancellationToken.None));
        Assert.Equal(ChatValidationTexts.TooManyMessages.Key, error.Message);
    }

    private static ChatSendThrottle Throttle(int limit) => new(new MemoryCache(new MemoryCacheOptions()),
        Options.Create(new OnlineChatSignalROptions { MessagesPerWindow = limit, SendWindowSeconds = 60 }));

    private static ChatMessageBllService Rules(IChatAccessService access, IChatSendThrottle throttle) =>
        new(access, new Mock<IChatBroadcaster>().Object, throttle, NullLogger<ChatMessageBllService>.Instance);
}
