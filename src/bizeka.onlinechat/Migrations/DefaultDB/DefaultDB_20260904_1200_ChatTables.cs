using FluentMigrator;
using Serenity.Extensions;

namespace Bizeka.OnlineChat.Migrations.DefaultDB;

[Tags("DefaultDB")]
[Migration(20260904_1200)]
public class DefaultDB_20260904_1200_ChatTables : AutoReversingMigration
{
    public override void Up()
    {
        Create.Table("ChatRooms")
            .WithColumn("Id").AsInt32().Identity().PrimaryKey().NotNullable()
            .WithColumn("ContextType").AsString(50).Nullable()
            .WithColumn("ContextId").AsInt32().Nullable()
            .WithColumn("Name").AsString(100).Nullable()
            .WithColumn("RoomType").AsInt16().NotNullable().WithDefaultValue(1) // 1=Direct, 2=Group, 3=General
            .WithColumn("InsertUserId").AsInt32().NotNullable()
            .WithColumn("InsertDate").AsDateTime().NotNullable()
            .WithColumn("UpdateUserId").AsInt32().Nullable()
            .WithColumn("UpdateDate").AsDateTime().Nullable()
            .WithColumn("DeleteUserId").AsInt32().Nullable()
            .WithColumn("DeleteDate").AsDateTime().Nullable()
            .WithColumn("IsActive").AsInt16().NotNullable().WithDefaultValue(1);

        Create.Table("ChatRoomMembers")
            .WithColumn("Id").AsInt32().Identity().PrimaryKey().NotNullable()
            .WithColumn("RoomId").AsInt32().NotNullable()
                .ForeignKey("FK_ChatRoomMembers_RoomId", "ChatRooms", "Id")
            .WithColumn("UserId").AsInt32().NotNullable() // Assuming foreign key to Users table handled conceptually or explicitly later if Users is in another module
            .WithColumn("Role").AsInt16().NotNullable().WithDefaultValue(1) // 1=Member, 2=Admin
            .WithColumn("InsertUserId").AsInt32().NotNullable()
            .WithColumn("InsertDate").AsDateTime().NotNullable()
            .WithColumn("UpdateUserId").AsInt32().Nullable()
            .WithColumn("UpdateDate").AsDateTime().Nullable()
            .WithColumn("DeleteUserId").AsInt32().Nullable()
            .WithColumn("DeleteDate").AsDateTime().Nullable()
            .WithColumn("IsActive").AsInt16().NotNullable().WithDefaultValue(1);

        Create.Table("ChatMessages")
            .WithColumn("Id").AsInt64().Identity().PrimaryKey().NotNullable()
            .WithColumn("RoomId").AsInt32().NotNullable()
                .ForeignKey("FK_ChatMessages_RoomId", "ChatRooms", "Id")
            .WithColumn("SenderId").AsInt32().NotNullable()
            .WithColumn("MessageText").AsString(int.MaxValue).Nullable()
            .WithColumn("FileUrl").AsString(500).Nullable()
            .WithColumn("ReplyToMessageId").AsInt64().Nullable()
                .ForeignKey("FK_ChatMessages_ReplyToMessageId", "ChatMessages", "Id")
            .WithColumn("IsForwarded").AsBoolean().NotNullable().WithDefaultValue(false)
            .WithColumn("SendDate").AsDateTime().NotNullable()
            .WithColumn("InsertUserId").AsInt32().NotNullable()
            .WithColumn("InsertDate").AsDateTime().NotNullable()
            .WithColumn("UpdateUserId").AsInt32().Nullable()
            .WithColumn("UpdateDate").AsDateTime().Nullable()
            .WithColumn("DeleteUserId").AsInt32().Nullable()
            .WithColumn("DeleteDate").AsDateTime().Nullable()
            .WithColumn("IsActive").AsInt16().NotNullable().WithDefaultValue(1);
    }
}
