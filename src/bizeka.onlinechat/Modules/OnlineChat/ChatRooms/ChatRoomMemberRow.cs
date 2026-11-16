using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace Bizeka.OnlineChat;

[ConnectionKey("Default"), Module("OnlineChat"), TableName("ChatRoomMembers")]
[DisplayName("ChatRoomMembers"), InstanceName("ChatRoomMembers" )]
[ReadPermission("OnlineChat:General")]
[ModifyPermission("OnlineChat:General")]
public sealed class ChatRoomMemberRow : Row<ChatRoomMemberRow.RowFields>, IIdRow, IInsertLogRow, IUpdateLogRow, IIsActiveDeletedRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("Room Id"), NotNull, ForeignKey("ChatRooms", "Id"), LeftJoin("jRoom")]
    public int? RoomId { get => fields.RoomId[this]; set => fields.RoomId[this] = value; }

    [DisplayName("User Id"), NotNull]
    public int? UserId { get => fields.UserId[this]; set => fields.UserId[this] = value; }

    [DisplayName("Role"), NotNull, DefaultValue(1)]
    public short? Role { get => fields.Role[this]; set => fields.Role[this] = value; }

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

    [DisplayName("Delete User Id")]
    public int? DeleteUserId { get => fields.DeleteUserId[this]; set => fields.DeleteUserId[this] = value; }

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
        public Int32Field Id = null!;
        public Int32Field RoomId = null!;
        public Int32Field UserId = null!;
        public Int16Field Role = null!;

        public Int32Field InsertUserId = null!;
        public DateTimeField InsertDate = null!;
        public Int32Field UpdateUserId = null!;
        public DateTimeField UpdateDate = null!;
        public Int32Field DeleteUserId = null!;
        public DateTimeField DeleteDate = null!;
        public Int16Field IsActive = null!;
    }
}
