namespace Bizeka.OnlineChat;

public class ChatMessageDto
{
    public long Id { get; set; }
    public int RoomId { get; set; }
    public int SenderId { get; set; }
    public string? SenderName { get; set; }
    public string? SenderUserImage { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public long? ReplyToMessageId { get; set; }
    public bool IsForwarded { get; set; }
    public DateTime SendDate { get; set; }
}
