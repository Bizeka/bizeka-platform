using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace Bizeka.OnlineChat;

[ConnectionKey("Default"), Module("OnlineChat"), TableName("ChatMessages")]
[DisplayName("ChatMessages"), InstanceName("ChatMessages" )]
[ReadPermission("OnlineChat:General")]
[ModifyPermission("OnlineChat:General")]
public sealed class ChatMessageRow : Row<ChatMessageRow.RowFields>, IIdRow, INameRow, IInsertLogRow, IUpdateLogRow, IIsActiveDeletedRow
{
    public const int MaxMessageLength = 4000;

    [DisplayName("Id"), Identity, IdProperty]
    public long? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("Room Id"), NotNull, ForeignKey("ChatRooms", "Id"), LeftJoin("jRoom")]
    public int? RoomId { get => fields.RoomId[this]; set => fields.RoomId[this] = value; }

    [Updatable(false)]
    [DisplayName("Sender Id"), ForeignKey("Users", "UserId"), LeftJoin("jSender")]
    public int? SenderId { get => fields.SenderId[this]; set => fields.SenderId[this] = value; }

    [DisplayName("Sender Name"), Expression("COALESCE(NULLIF(jSender.[DisplayName], ''), jSender.[Username])"), MinSelectLevel(SelectLevel.List)]
    public string? SenderName { get => fields.SenderName[this]; set => fields.SenderName[this] = value; }

    [DisplayName("Sender User Image"), Expression("jSender.[UserImage]"), MinSelectLevel(SelectLevel.List)]
    public string? SenderUserImage { get => fields.SenderUserImage[this]; set => fields.SenderUserImage[this] = value; }

    [DisplayName("Message Text"), NameProperty, Size(MaxMessageLength)]
    public string? MessageText { get => fields.MessageText[this]; set => fields.MessageText[this] = value; }

    // Attachments are not supported; the column is kept for schema compatibility and never written by clients.
    [DisplayName("File Url"), Size(500), Insertable(false), Updatable(false)]
    public string? FileUrl { get => fields.FileUrl[this]; set => fields.FileUrl[this] = value; }

    [DisplayName("Reply To Message Id"), ForeignKey("ChatMessages", "Id"), LeftJoin("jReply")]
    public long? ReplyToMessageId { get => fields.ReplyToMessageId[this]; set => fields.ReplyToMessageId[this] = value; }

    [DisplayName("Is Forwarded"), NotNull, DefaultValue(false)]
    public bool? IsForwarded { get => fields.IsForwarded[this]; set => fields.IsForwarded[this] = value; }

    [Updatable(false)]
    [DisplayName("Send Date")]
    public DateTime? SendDate { get => fields.SendDate[this]; set => fields.SendDate[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Insert User Id")]
    public int? InsertUserId { get => fields.InsertUserId[this]; set => fields.InsertUserId[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Insert Date")]
    public DateTime? InsertDate { get => fields.InsertDate[this]; set => fields.InsertDate[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Update User Id")]
    public int? UpdateUserId { get => fields.UpdateUserId[this]; set => fields.UpdateUserId[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Update Date")]
    public DateTime? UpdateDate { get => fields.UpdateDate[this]; set => fields.UpdateDate[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Delete User Id")]
    public int? DeleteUserId { get => fields.DeleteUserId[this]; set => fields.DeleteUserId[this] = value; }

    [Insertable(false), Updatable(false)]
    [DisplayName("Delete Date")]
    public DateTime? DeleteDate { get => fields.DeleteDate[this]; set => fields.DeleteDate[this] = value; }

    [DisplayName("Is Active"), NotNull, DefaultValue(1)]
    public short? IsActive { get => fields.IsActive[this]; set => fields.IsActive[this] = value; }

    Field IInsertUserIdRow.InsertUserIdField => fields.InsertUserId;
    DateTimeField IInsertDateRow.InsertDateField => fields.InsertDate;
    Field IUpdateUserIdRow.UpdateUserIdField => fields.UpdateUserId;
    DateTimeField IUpdateDateRow.UpdateDateField => fields.UpdateDate;
    Int16Field IIsActiveRow.IsActiveField => fields.IsActive;

    public sealed class RowFields : RowFieldsBase
    {
        public Int64Field Id = null!;
        public Int32Field RoomId = null!;
        public Int32Field SenderId = null!;
        public StringField SenderName = null!;
        public StringField SenderUserImage = null!;
        public StringField MessageText = null!;
        public StringField FileUrl = null!;
        public Int64Field ReplyToMessageId = null!;
        public BooleanField IsForwarded = null!;
        public DateTimeField SendDate = null!;

        public Int32Field InsertUserId = null!;
        public DateTimeField InsertDate = null!;
        public Int32Field UpdateUserId = null!;
        public DateTimeField UpdateDate = null!;
        public Int32Field DeleteUserId = null!;
        public DateTimeField DeleteDate = null!;
        public Int16Field IsActive = null!;
    }
}
