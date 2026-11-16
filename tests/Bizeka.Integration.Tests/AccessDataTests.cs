using System.Security.Claims;
using Bizeka.Todo;
using Bizeka.Todo.AppServices;
using Bizeka.OnlineChat;
using Bizeka.OnlineChat.AppServices;
using Bizeka.DynamicForms;
using Serenity.Data;
using Serenity.Services;
using Xunit;

namespace Bizeka.Integration.Tests;

public sealed class AccessDataTests
{
    public static IEnumerable<object[]> Providers() =>
        (Environment.GetEnvironmentVariable("BIZEKA_PLATFORM_PROVIDERS") ?? "Sqlite").Split(',').Select(x => new object[] { x });

    private static ClaimsPrincipal User(int id, string name = "user") => new(new ClaimsIdentity([
        new Claim(ClaimTypes.NameIdentifier, id.ToString()), new Claim(ClaimTypes.Name, name)], "Test"));

    [Theory]
    [MemberData(nameof(Providers))]
    public async Task DataBoundaries(string provider)
    {
        using var fixture = new DatabaseFixture(provider);
        var c = fixture.Connection;
        var ct = CancellationToken.None;
        Assert.Equal(3, await c.CountAsync<TaskPriorityRow>(ct));
        Assert.Equal(4, await c.CountAsync<TaskStatusRow>(ct));
        Assert.True(await c.ExistsAsync<DynamicFormDefinitionRow>(DynamicFormDefinitionRow.Fields.FormKey == "Todo.TaskItem", ct));
        var task = new TaskItemRow { Summary = "Private", SortOrder = 10, TaskStatusId = 1, InsertUserId = 2,
            AssignedByUserId = 2, InsertDate = DateTime.UtcNow };
        task.Id = (int)(await c.InsertAndGetIDAsync(task, ct))!.Value;
        await c.InsertAsync(new TaskAssigneeRow { TaskItemId = task.Id, UserId = 3 }, ct);
        Assert.Equal(0, await c.CountAsync<TaskItemRow>(TaskVisibility.CriteriaFor(99), ct));
        Assert.Equal(1, await c.CountAsync<TaskItemRow>(TaskVisibility.CriteriaFor(2), ct));
        Assert.Equal(1, await c.CountAsync<TaskItemRow>(TaskVisibility.CriteriaFor(3), ct));
        var rules = new TaskItemBllService();
        var changed = new TaskItemRow { TaskStatusId = 1, Summary = "Changed" };
        await Assert.ThrowsAsync<ValidationError>(() => rules.ValidateAsync(c, changed, task, User(99, "admin"), ct));
        await rules.ValidateAsync(c, changed, task, User(3), ct);
        Assert.Equal(2, changed.AssignedByUserId);
        Assert.Equal(20, await rules.NextOrderAsync(c, ct));
        changed.EstimatedMinutes = -1;
        await Assert.ThrowsAsync<ValidationError>(() => rules.ValidateAsync(c, changed, task, User(3), ct));
        changed.EstimatedMinutes = 0;
        changed.TaskStatusId = null;
        await Assert.ThrowsAsync<ValidationError>(() => rules.ValidateAsync(c, changed, task, User(3), ct));
        changed.TaskStatusId = 4;
        await rules.ValidateAsync(c, changed, task, User(3), ct);
        Assert.Equal(TimeSpan.Zero, changed.CompletedOn!.Value.TimeOfDay);

        var room = new ChatRoomRow { Name = "Private", RoomType = 2, IsActive = 1, InsertUserId = 2, InsertDate = DateTime.UtcNow };
        room.Id = (int)(await c.InsertAndGetIDAsync(room, ct))!.Value;
        await c.InsertAsync(new ChatRoomMemberRow { RoomId = room.Id, UserId = 3, Role = 1, IsActive = 1,
            InsertUserId = 2, InsertDate = DateTime.UtcNow }, ct);
        var access = new ChatAccessService();
        await access.DemandAsync(c, room.Id.Value, User(3), ct);
        await Assert.ThrowsAsync<ValidationError>(() => access.DemandAsync(c, room.Id.Value, User(99, "admin"), ct));
        var message = new ChatMessageRow { RoomId = room.Id, SenderId = 2, MessageText = "Private message", IsForwarded = false,
            SendDate = DateTime.UtcNow, InsertUserId = 2, InsertDate = DateTime.UtcNow, IsActive = 1 };
        await c.InsertAsync(message, ct);
        Assert.Equal(0, await c.CountAsync<ChatMessageRow>(access.MessagesFor(User(99)), ct));
        Assert.Equal(1, await c.CountAsync<ChatMessageRow>(access.MessagesFor(User(3)), ct));
        await c.ExecuteAsync("UPDATE [ChatRoomMembers] SET [IsActive] = 0 WHERE [UserId] = 3", cancellationToken: ct);
        await Assert.ThrowsAsync<ValidationError>(() => access.DemandAsync(c, room.Id.Value, User(3), ct));
        Assert.Equal(0, await c.CountAsync<ChatMessageRow>(access.MessagesFor(User(3)), ct));
        var anonymous = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "2")]));
        await Assert.ThrowsAsync<ValidationError>(() => access.DemandAsync(c, room.Id.Value, anonymous, ct));
    }
}
