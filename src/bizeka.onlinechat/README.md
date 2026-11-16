# Bizeka.OnlineChat

[![Serenity](https://img.shields.io/badge/Platform-Serenity-success.svg)](https://github.com/serenity-is/Serenity)

Open source Serenity module for real-time messaging and chat functionality. This project is part of the **Bizeka Platform** and is an MIT-licensed alpha release ([license](../../LICENSE)).

`Bizeka.OnlineChat` provides a robust, SignalR-powered messaging infrastructure to seamlessly integrate real-time communication into your Serenity applications.

## Product Position

This package is the community-ready core.

It is intentionally focused on:

- Real-time SignalR hub integration for messaging
- Simple one-on-one and basic group text conversations
- User presence tracking (Online/Offline status)
- Chat database entity models (`ChatMessages`, `ChatRooms`, `ChatRoomMembers`)
- Standard text messaging and essential UI components

It does not try to carry every advanced enterprise feature. Audio and voice recording, message deletion, read receipts and end-to-end encryption are outside the scope of this module.


## Integration in a Serene 10.6.3 Host

The package commands below describe the intended package names. NuGet/npm packages coming soon; until then, use the locally built NuGet feed and npm tarballs. Restore Serenity framework packages through the host before installing the module. See the [repository setup](../../README.md).

### 1. Install Packages

**NuGet (Backend):**
```bash
dotnet add package Bizeka.OnlineChat --prerelease
```

**NPM (Frontend):**
```bash
npm install ./bizeka-onlinechat-0.1.3-alpha.tgz
```

### 2. Startup Configuration

`Bizeka.OnlineChat` ships two extension methods that cover **all** required DI and endpoint wiring. You do **not** need to call `AddSignalR()` separately — `AddBizekaOnlineChat()` handles it.

**`Startup.cs` → `ConfigureServices`:**

```csharp
// Registers SignalR, room access rules, messaging and process-local presence.
services.AddBizekaOnlineChat(Configuration);
```

**`Startup.cs` → `Configure` (inside `UseEndpoints`):**

```csharp
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();

    // Maps ChatHub to /chathub route.
    endpoints.MapBizekaOnlineChatHubs();
});
```

**Optional `appsettings.json` section**:

```json
"OnlineChatSignalR": {
    "UseRedisBackplane": false,
    "RedisConnectionString": "",
    "MessagesPerWindow": 30,
    "SendWindowSeconds": 60
}
```

A user may send `MessagesPerWindow` messages per `SendWindowSeconds` (default 30 per minute; `0` disables the limit). The limit is per process, so a multi-instance host needs its own gateway limit. Messages are plain text, required and at most 4,000 characters.

Redis backplane is not implemented; enabling it fails at startup. Presence tracks multiple
connections per user in one process. Multi-instance presence and durable notification delivery
are outside this module's current scope. Message notifications are sent after a successful commit.
Private messages are delivered only to current room members and the room creator.

TR: Host servis kaydı ve hub eşlemesini yapar; oda erişimi ve mesaj kuralları modülde kalır.
Özel odalara yalnızca oda sahibi ve aktif üyeler erişir. Üyelik kaldırıldığında erişim kapanır.
Çevrimiçi durumu tek süreçte kullanıcının birden fazla bağlantısını izler. Redis desteği yoktur.

### 3. Database Migrations

`Bizeka.OnlineChat` creates its tables (`ChatRooms`, `ChatRoomMembers`, `ChatMessages`) in the `Default` connection key. The migrations are tagged `DefaultDB` so they run automatically when `DataMigrations.cs` iterates the `Default` database key.

No extra connection string is required.

### 4. Frontend Integration

In your `Modules/Common/ScriptInit.ts` (or equivalent initialization file):

```ts
import { initializeOnlineChat } from "@bizeka/onlinechat";

initializeOnlineChat();
```

## Contributing & License

Released under the [MIT license](../../LICENSE). This is an alpha (`0.1.3-alpha`), not production-certified; see the [public gate](../../docs/release/public-gate.md).
For contribution guidelines, code of conduct, and reporting issues, please refer to the root `bizeka-platform` repository documentation.

## File attachments

The message composer supports text messages only. File upload is not integrated: the module does not promote temporary uploads to permanent storage or enforce room membership on file downloads. The attachment control is therefore omitted. Hosts must implement and verify the complete storage and authorization lifecycle before adding file sending. The server rejects client values for the `FileUrl` column (kept only for schema compatibility) and the panel never renders message text as a link or image.

TR: Mesaj yazma alanı yalnızca metin gönderir. Kalıcı dosya saklama ve oda bazlı dosya erişimi entegre edilmediği için dosya ekleme simgesi gösterilmez. Sunucu istemciden gelen `FileUrl` değerini yazmaz; mesaj metni bağlantıya ya da görsele dönüştürülmez. Kullanıcı başına gönderim sınırı vardır (varsayılan dakikada 30 mesaj) ve mesaj en fazla 4.000 karakterdir.
