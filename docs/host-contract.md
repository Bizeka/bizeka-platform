---
status: active
scope: platform
version: 1
last_reviewed: 2026-10-24
---

# Host contract

What a consuming Serenity 10.6.3 host must provide for the Platform modules, and what the modules assume about it. The modules are libraries; the host owns everything listed under "Host responsibilities" in [SECURITY.md](../SECURITY.md). Verified against the source on 2026-10-22.

## Baseline

The host is a Serene 10.6.3 application (or equivalent) with Serenity type discovery, `Administration` users and roles, permission service, localization, dynamic scripts and the standard upload, CSRF and authentication setup. Module assemblies must be part of the type source (application parts) so that rows, endpoints, pages, lookups, navigation and texts are discovered.

## Registration

| Module | Services | Endpoints and client |
| --- | --- | --- |
| Extensions | Type discovery only | Import `@bizeka/extensions` where its editors and formatters are used |
| DynamicForms | Type discovery only | `@bizeka/dynamicforms` |
| Todo | `services.AddBizekaTodo()` | `@bizeka/todo` |
| OnlineChat | `services.AddBizekaOnlineChat(configuration)` | `endpoints.MapBizekaOnlineChatHubs()` maps `/chathub`; call `initializeOnlineChat()` from the host script init and import `@bizeka/onlinechat/styles.css` (the package entry carries no styles) |
| Theme | `services.AddBizekaTheme()` (adds the assembly as an application part for its texts) | Load `bizeka-theme/bizeka-theme-init.js` as a plain script in `<head>` and `bizeka-theme/bizeka-theme.css` after the Serenity styles; call `initBizekaTheme()` from the host script init |
| Demo | Type discovery only | Optional; sample pages under `~/Demo/`, one example migration. The Northwind sample needs `Serenity.Demo.Northwind` |

The service extensions live in the module namespaces: `using Bizeka.Todo;`, `using Bizeka.OnlineChat;` and `using Bizeka.Theme;` in the host's startup. The step-by-step setup is in [host-integration.md](host-integration.md).

## Database

- **Connection key.** Every row and the chat hub use the connection key `Default`; all tables live in the host's Default database. The key is not configurable yet; a host that needs another database maps it with a connection fallback.
- **Migrations.** FluentMigrator migrations tagged `DefaultDB` in each module assembly. The host's `DataMigrations` must scan module assemblies for the Default database. Version numbers share the host's `VersionInfo` table, so they must be unique across the host and all modules; the modules use `YYYYMMDD_HHMM` timestamps.
- **Tables created:** DynamicForms `DynamicFormDefinitions`; Todo `TaskPriorities`, `TaskStatuses`, `TaskItems`, `TaskAssignees`; OnlineChat `ChatRooms`, `ChatRoomMembers`, `ChatMessages`. Seed data: Todo priorities and statuses, the Todo task dynamic-field definition, one public chat room. Demo adds one example definition for the Northwind customer form.
- **Host tables read:** OnlineChat joins `Users` (`UserId`, `Username`, `DisplayName`, `UserImage`) to show senders. The Serene `Users` schema satisfies this.
- **Providers:** PostgreSQL, SQL Server (2012 dialect) and MySQL. SQLite is a test target. Oracle is not supported.

## Identity and permissions

- User ids are integers carried in the `ClaimTypes.NameIdentifier` claim; non-numeric or missing ids are treated as no access.
- Permission keys the host must grant through its role or user permission screens:

| Module | Keys |
| --- | --- |
| DynamicForms | `DynamicForms:General` (read definitions), `DynamicForms:Manage` (edit and delete) |
| Todo | `Todo:TaskItems:View`, `:Create`, `:Update`, `:Delete`; `Todo:TaskPriorities:View`, `:Modify`; `Todo:TaskStatuses:View`, `:Modify` |
| OnlineChat | `OnlineChat:General` (rows and hub) |

- Todo uses the host lookup `Administration.User` for assignees.
- The `DynamicForms.DynamicFormDefinition` lookup is readable by any authenticated user by design: dialogs of other modules render those field schemas. It contains active form schemas only, no record data.

## Tenancy and scale

No module adds a tenant or company boundary. Todo visibility is per user (creator, assigner, assignee); OnlineChat access is per room membership, and public rooms are visible to every user with `OnlineChat:General`. A multi-tenant host must add its own boundary before enabling these modules. OnlineChat presence and the send limit are per process; Redis backplane is not supported, so run one instance or put a gateway limit and sticky sessions in front.

## Files

No module stores uploaded files. OnlineChat messages are text only; the `FileUrl` column is not writable by clients. Todo's `AttachmentsJson` column is reserved and not rendered. Sender avatars are read from the host's `~/upload/` path through `Users.UserImage`.

## Security headers and HTTP

HTTPS, cookie policy, anti-forgery, CSP and other headers belong to the host. OnlineChat requires authenticated SignalR connections and sets a 100 KB maximum hub message size.
