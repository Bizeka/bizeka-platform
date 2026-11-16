using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Serenity.Abstractions;
using Serenity.Data;
using Bizeka.OnlineChat.AppServices;

namespace Bizeka.OnlineChat;

[Authorize]
public sealed class ChatHub(ISqlConnections connections, IChatAccessService access, IPermissionService permissions,
    OnlineChatPresenceTracker presence, IUserRetrieveService users) : Hub<IOnlineChatClient>
{
    private const string CountedKey = "Bizeka.OnlineChat.PresenceCounted";

    private string PresenceName() =>
        users.ById(Context.UserIdentifier!)?.DisplayName ?? Context.User?.Identity?.Name ?? Context.UserIdentifier!;

    public override async Task OnConnectedAsync()
    {
        if (!permissions.HasPermission("OnlineChat:General"))
        {
            Context.Abort();
            return;
        }
        await Groups.AddToGroupAsync(Context.ConnectionId, "General", Context.ConnectionAborted).ConfigureAwait(false);
        Context.Items[CountedKey] = true;
        if (presence.Connect(Context.UserIdentifier) && int.TryParse(Context.UserIdentifier, out var id))
            // Connect is true only for the user's first connection, so this leaves out only the user.
            await Clients.OthersInGroup("General").UserPresenceChanged(id, PresenceName(), true).ConfigureAwait(false);
        await base.OnConnectedAsync().ConfigureAwait(false);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // A connection refused above was never counted; it must not take the user's real connection off the count.
        if (Context.Items.ContainsKey(CountedKey) && presence.Disconnect(Context.UserIdentifier) && int.TryParse(Context.UserIdentifier, out var id))
            await Clients.Group("General").UserPresenceChanged(id, PresenceName(), false).ConfigureAwait(false);
        await base.OnDisconnectedAsync(exception).ConfigureAwait(false);
    }

    public async Task JoinRoom(int roomId)
    {
        if (!permissions.HasPermission("OnlineChat:General")) throw new HubException("AccessDenied");
        using var connection = connections.NewByKey("Default");
        await access.DemandAsync(connection, roomId, Context.User!, Context.ConnectionAborted).ConfigureAwait(false);
        // Delivery resolves current recipients from the database instead of retaining stale private-room groups.
    }

    public Task LeaveRoom(int roomId) => Task.CompletedTask;
}
