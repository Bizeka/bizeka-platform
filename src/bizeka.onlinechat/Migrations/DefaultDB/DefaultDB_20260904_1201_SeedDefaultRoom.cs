using FluentMigrator;
using System;

namespace Bizeka.OnlineChat.Migrations.DefaultDB;

[Tags("DefaultDB")]
[Migration(20260904_1201)]
public class DefaultDB_20260904_1201_SeedDefaultRoom : Migration
{
    public override void Up()
    {
        Insert.IntoTable("ChatRooms")
            .Row(new
            {
                Name = "General",
                RoomType = 3,
                IsActive = 1,
                InsertUserId = 1,
                InsertDate = DateTime.UtcNow
            });
    }

    public override void Down()
    {
    }
}
