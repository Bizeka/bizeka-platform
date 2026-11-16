using Bizeka.OnlineChat;
using Bizeka.OnlineChat.AppServices;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Serenity;
using Serenity.Abstractions;
using Serenity.Data;

namespace Bizeka.OnlineChat.Tests;

public sealed class ChatHubTests
{
    [Fact]
    public async Task HubAbortsWithoutPermission()
    {
        var context = new Mock<HubCallerContext>();
        context.SetupGet(x => x.UserIdentifier).Returns("7");
        var presence = new OnlineChatPresenceTracker();
        var hub = Hub(presence);
        hub.Context = context.Object;

        await hub.OnConnectedAsync();

        context.Verify(x => x.Abort(), Times.Once);
        // The aborted connection was never counted as online.
        Assert.True(presence.Connect("7"));
    }

    [Fact]
    public async Task ARefusedConnectionDoesNotTakeTheUserOffline()
    {
        var context = new Mock<HubCallerContext>();
        context.SetupGet(x => x.UserIdentifier).Returns("7");
        context.SetupGet(x => x.Items).Returns(new Dictionary<object, object?>());
        var presence = new OnlineChatPresenceTracker();
        presence.Connect("7");
        var hub = Hub(presence);
        hub.Context = context.Object;

        await hub.OnConnectedAsync();
        await hub.OnDisconnectedAsync(null);

        // The real connection is still counted, so a second one is not the user's first.
        Assert.False(presence.Connect("7"));
    }

    [Fact]
    public async Task ComingOnlineGoesToOthersWithTheDisplayName()
    {
        var context = new Mock<HubCallerContext>();
        context.SetupGet(x => x.UserIdentifier).Returns("7");
        context.SetupGet(x => x.ConnectionId).Returns("c1");
        context.SetupGet(x => x.Items).Returns(new Dictionary<object, object?>());
        var client = new Mock<IOnlineChatClient>();
        var clients = new Mock<IHubCallerClients<IOnlineChatClient>>(MockBehavior.Strict);
        clients.Setup(x => x.OthersInGroup("General")).Returns(client.Object);
        var permissions = new Mock<IPermissionService>();
        permissions.Setup(x => x.HasPermission("OnlineChat:General")).Returns(true);
        var user = new Mock<IUserDefinition>();
        user.SetupGet(x => x.DisplayName).Returns("Ada Yilmaz");
        var users = new Mock<IUserRetrieveService>();
        users.Setup(x => x.ById("7")).Returns(user.Object);
        var hub = new ChatHub(new Mock<ISqlConnections>(MockBehavior.Strict).Object,
            new Mock<IChatAccessService>(MockBehavior.Strict).Object, permissions.Object, new OnlineChatPresenceTracker(), users.Object)
        {
            Context = context.Object,
            Clients = clients.Object,
            Groups = new Mock<IGroupManager>().Object
        };

        await hub.OnConnectedAsync();

        client.Verify(x => x.UserPresenceChanged(7, "Ada Yilmaz", true), Times.Once);
    }

    [Fact]
    public async Task JoinRoomNeedsPermission()
    {
        var hub = Hub(new OnlineChatPresenceTracker());
        hub.Context = new Mock<HubCallerContext>().Object;
        await Assert.ThrowsAsync<HubException>(() => hub.JoinRoom(1));
    }

    private static ChatHub Hub(OnlineChatPresenceTracker presence)
    {
        var permissions = new Mock<IPermissionService>();
        permissions.Setup(x => x.HasPermission(It.IsAny<string>())).Returns(false);
        return new ChatHub(new Mock<ISqlConnections>(MockBehavior.Strict).Object,
            new Mock<IChatAccessService>(MockBehavior.Strict).Object, permissions.Object, presence,
            new Mock<IUserRetrieveService>(MockBehavior.Strict).Object);
    }
}
