using Serenity.ComponentModel;
using Serenity.Data;
using Serenity.Data.Mapping;
using System;
using System.ComponentModel;

namespace Bizeka.OnlineChat;

[ConnectionKey("Default"), Module("OnlineChat"), TableName("ChatRooms")]
[DisplayName("ChatRooms"), InstanceName("ChatRooms" )]
[ReadPermission("OnlineChat:General")]
[ModifyPermission("OnlineChat:General")]
public sealed class ChatRoomRow : Row<ChatRoomRow.RowFields>, IIdRow, INameRow, IInsertLogRow, IUpdateLogRow, IIsActiveDeletedRow
{
    [DisplayName("Id"), Identity, IdProperty]
    public int? Id { get => fields.Id[this]; set => fields.Id[this] = value; }

    [DisplayName("Context Type"), Size(50)]
    public string? ContextType { get => fields.ContextType[this]; set => fields.ContextType[this] = value; }

    [DisplayName("Context Id")]
    public int? ContextId { get => fields.ContextId[this]; set => fields.ContextId[this] = value; }

    [DisplayName("Name"), Size(100), NameProperty]
    public string? Name { get => fields.Name[this]; set => fields.Name[this] = value; }

    [DisplayName("Room Type"), NotNull]
    public short? RoomType { get => fields.RoomType[this]; set => fields.RoomType[this] = value; }

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
        public StringField ContextType = null!;
        public Int32Field ContextId = null!;
        public StringField Name = null!;
        public Int16Field RoomType = null!;

        public Int32Field InsertUserId = null!;
        public DateTimeField InsertDate = null!;
        public Int32Field UpdateUserId = null!;
        public DateTimeField UpdateDate = null!;
        public Int32Field DeleteUserId = null!;
        public DateTimeField DeleteDate = null!;
        public Int16Field IsActive = null!;
    }
}
