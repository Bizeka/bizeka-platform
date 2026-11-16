using System.Data;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Security.Claims;
using Serenity.Data;
using Serenity.Services;
using Bizeka.OnlineChat.Texts;

namespace Bizeka.OnlineChat.AppServices;

public sealed class ChatMessageBllService(IChatAccessService access, IChatBroadcaster broadcaster,
    IChatSendThrottle throttle, ILogger<ChatMessageBllService> logger) : IChatMessageBllService
{
    public async Task ValidateAsync(IDbConnection connection, ChatMessageRow row, ChatMessageRow? old,
        ClaimsPrincipal? user, CancellationToken cancellationToken)
    {
        if (row.RoomId is null || string.IsNullOrWhiteSpace(row.MessageText ?? old?.MessageText) ||
            !int.TryParse(user?.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var id))
            throw new ValidationError(ChatValidationTexts.InvalidMessage.Key);
        if (old is null && !throttle.TryAcquire(id))
            throw new ValidationError(ChatValidationTexts.TooManyMessages.Key);
        await access.DemandAsync(connection, row.RoomId.Value, user, cancellationToken).ConfigureAwait(false);
        if (old is not null && (old.SenderId != id || old.RoomId != row.RoomId))
            throw new ValidationError(ChatValidationTexts.AccessDenied.Key);
        if (row.ReplyToMessageId.HasValue && !await connection.ExistsAsync<ChatMessageRow>(
            ChatMessageRow.Fields.Id == row.ReplyToMessageId.Value & ChatMessageRow.Fields.RoomId == row.RoomId.Value &
            ChatMessageRow.Fields.IsActive == 1, cancellationToken).ConfigureAwait(false))
            throw new ValidationError(ChatValidationTexts.InvalidMessage.Key);
        row.SenderId = old?.SenderId ?? id;
        row.SendDate = old?.SendDate ?? DateTime.UtcNow;
        row.IsForwarded ??= false;
    }

    public async Task NotifyAsync(IDbConnection connection, long messageId, CancellationToken cancellationToken)
    {
        try
        {
        var row = await connection.TryFirstAsync<ChatMessageRow>(q => q.SelectTableFields()
            .Select(ChatMessageRow.Fields.SenderName).Where(ChatMessageRow.Fields.Id == messageId),
            cancellationToken).ConfigureAwait(false);
        if (row is null) return;
        var room = await connection.TryFirstAsync<ChatRoomRow>(q => q.SelectTableFields()
            .Where(ChatRoomRow.Fields.Id == row.RoomId!.Value), cancellationToken).ConfigureAwait(false);
        if (room?.IsActive != 1) return;
        var members = await connection.ListAsync<ChatRoomMemberRow>(q => q.Select(ChatRoomMemberRow.Fields.UserId)
            .Where(ChatRoomMemberRow.Fields.RoomId == row.RoomId!.Value & ChatRoomMemberRow.Fields.IsActive == 1),
            cancellationToken).ConfigureAwait(false);
        var recipients = members.Select(x => x.UserId!.Value).Append(room.InsertUserId!.Value).Distinct()
            .Select(x => x.ToString(CultureInfo.InvariantCulture)).ToArray();
        await broadcaster.BroadcastMessageAsync(new ChatMessageDto { Id = row.Id!.Value, RoomId = row.RoomId!.Value,
            SenderId = row.SenderId!.Value, SenderName = row.SenderName, MessageText = row.MessageText ?? "",
            ReplyToMessageId = row.ReplyToMessageId, IsForwarded = row.IsForwarded ?? false,
            SendDate = row.SendDate!.Value }, recipients, room.RoomType == 3, cancellationToken).ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            logger.LogWarning(exception, "Realtime notification failed for committed chat message {MessageId}", messageId);
        }
    }
}
