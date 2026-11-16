---
status: active
scope: repository
version: 1
last_reviewed: 2026-11-07
---

# Reviewer guide

For the Serenity maintainers reviewing the preview of Bizeka Platform. It explains what the repository is, how the modules fit together, how to see them running, and the questions we would most like answered. Your feedback decides what changes before the open-source release.

## What this is

Six Serenity 10.6.3 modules for .NET 10, written to be installed into an existing Serene-style host as NuGet packages (server code, Razor views, static web assets) plus npm packages (TypeScript types and bundles). The repository has no host of its own. Version `0.1.3-alpha`, MIT-licensed alpha ([ADR 0001](adr/0001-production-ready-gate.md)).

| Module | What it adds |
| --- | --- |
| Extensions | Editors (switch, yes/no, checkbox list, color, stepper, phone, month, tags, auto-complete, empty lookup, static text) and grid formatters; `JsonDataRow` and `JsonDataDialog`, which keep extra fields in one JSON column |
| DynamicForms | Definitions of extra form fields stored in the database, a field designer, and `DynamicBaseDialog`, which adds the defined fields to any entity dialog |
| Todo | Tasks with priorities, statuses, assignees and per-user visibility |
| OnlineChat (preview) | Rooms, messages and presence over SignalR |
| Theme | A CSS token layer with light, dark and accent support over Serenity's own styles |
| Demo | Fifteen samples in the style of `Demo.BasicSamples` |

About 7,000 lines of C# and TypeScript, excluding generated server types.

## Architecture

### Dependencies

```
Extensions  <-  DynamicForms  <-  Todo
OnlineChat      Theme
Demo  ->  all of the above, Serenity.Demo.Northwind
```

All modules depend only on Serenity packages (`Serenity.Net.Web`, `Serenity.Extensions`, `Serenity.Corelib`) and FluentMigrator. Nothing depends on commercial code; the repository guard `platform-boundary` and `ArchitectureTests` enforce this ([ADR 0002](adr/0002-no-commercial-dependency.md)). A separate commercial product builds on these modules; it is not part of this review.

### Conventions

- **Layout.** Each module is a Razor class library with Serenity's usual `Modules/<Feature>` folders, `Migrations/DefaultDB`, `texts` and generated `Modules/ServerTypes`. Generated output is produced by Sergen 10.6.3 and never edited by hand; CI fails if regeneration changes it.
- **Keys.** Server and client keys use the module name: `Bizeka.Extensions.ColorHexEditor`, form keys `Todo.TaskItem`, permissions `Todo:TaskItems:View`, lookups `DynamicForms.DynamicFormDefinition`.
- **Business rules** that are more than CRUD live in small application services in an `AppServices` namespace (for example `TaskItemBllService`, `ChatAccessService`), registered through `services.AddBizekaTodo()` and `services.AddBizekaOnlineChat(configuration)`. Request handlers stay thin.
- **Data.** Every row uses the connection key `Default` and FluentMigrator migrations tagged `DefaultDB`, numbered `YYYYMMDD_HHMM` so they cannot collide with the host. PostgreSQL, SQL Server and MySQL are tested on every data change; Oracle is not supported.
- **Client.** TypeScript in strict mode, bundled with `@serenity-is/tsbuild` into `wwwroot/esm` (served as `_content/Bizeka.<Module>/esm/...`). The npm package exposes the same classes from `dist/index.js` for hosts and other modules.
- **Localization.** English defaults in C# `LocalText` classes, generated `*.texts.__.json` templates and Turkish translations; a guard checks that every key is translated.

### What a host provides

[host-integration.md](host-integration.md) walks through adding each module to a Serene host (project, startup, script init, layout). [host-contract.md](host-contract.md) lists everything: type discovery, the `Default` connection, migrations scanning module assemblies, the `Users` table columns OnlineChat reads, the permission keys, the two service registrations, the SignalR hub mapping and the stylesheets. Hosts own authentication, HTTPS, anti-forgery, CSP and other headers ([SECURITY.md](../SECURITY.md)).

### Security boundaries worth checking

- Todo: list, retrieve, update and delete are filtered to tasks the user created, assigned or is assigned to (`TaskVisibility.CriteriaFor`); the assigner is set by the server.
- OnlineChat: hub and endpoints require `OnlineChat:General` and room membership; messages are text only (4,000 characters), `FileUrl` is not client-writable, and sending is rate limited per user. Presence and the limit are per process; there is no tenant boundary.
- DynamicForms: the definition lookup is readable by any signed-in user because other modules' dialogs need the schemas; it returns active definitions only and holds no record data. Editing requires `DynamicForms:Manage`.

## See it running

There is no hosted demo yet; a public Community demo host is planned. Running the modules locally takes about fifteen minutes and needs Windows or Linux, .NET SDK 10, Node.js 24, PowerShell 7 and a database (SQL Server LocalDB is enough).

1. **Build the modules.** Clone to a short path on Windows (nested esbuild paths exceed 260 characters, and the SQL Server native client does not load from a long path), then run from the repository root:

   ```powershell
   ./tools/Initialize-Dependencies.ps1
   dotnet build Bizeka.Platform.slnx -c Release --no-restore -m:1
   ```

2. **Create a host.** `dotnet new serene -n DemoHost` with Serene.Templates 10.6.3 and the demo modules (Northwind) enabled.

3. **Reference the modules.** In `DemoHost.Web.csproj`, add project references to the six `src/bizeka.*/Bizeka.*.csproj` files, and raise `Microsoft.Data.SqlClient` to 7.1.1 and `Microsoft.Data.Sqlite` to 10.0.13 to match the modules. (Alternatively, `./tools/Test-Packages.ps1` writes NuGet and npm archives to `artifacts/packages` for a local feed.)

4. **Register them** as in the host contract. In `Initialization/Startup.cs`:

   ```csharp
   using Bizeka.OnlineChat;
   using Bizeka.Todo;
   // ConfigureServices
   services.AddBizekaTodo();
   services.AddBizekaOnlineChat(Configuration);
   // UseEndpoints
   endpoints.MapBizekaOnlineChatHubs();
   ```

   and in `Views/Shared/_LayoutHead.cshtml`, after `@Html.StyleBundle("Base")`:

   ```cshtml
   <script src="@Html.ResolveWithHash("~/_content/Bizeka.Theme/bizeka-theme/bizeka-theme-init.js")" nonce="@nonce"></script>
   <link rel="stylesheet" href="@Html.ResolveWithHash("~/_content/Bizeka.Theme/bizeka-theme/bizeka-theme.css")" />
   ```

5. **Run** the host and sign in as `admin`. The module migrations run with the host's own. The samples are under **Bizeka Samples** (`~/Demo/ChoiceEditors` and so on); the module screens are under **Bizeka Platform**. Each sample has a description and a **Source files** section with its code.

This is the setup used to verify the samples on 2026-10-24 ([evidence](release/public-gate.md)). The floating chat widget additionally needs `initializeOnlineChat()` and `import "@bizeka/onlinechat/styles.css"` in the host's `ScriptInit.ts`; the samples work without it.

## Questions for the Serenity team

We would value short answers, links or "do it like X in Serenity" pointers as much as long ones.

**Fit with Serenity**

1. Do these modules follow Serenity conventions closely enough that a Serenity user would feel at home? Anything that reads as fighting the framework?
2. Is there anything here that Serenity already provides or plans to provide, so that we should drop ours? For example, `StaticTextBlock` duplicates the Serenity.Extensions editor of the same name (a form that imports both namespaces needs an alias), and some editors may overlap with editors you already ship.
3. Key naming: we use `Bizeka.<Module>.<Type>` for client types and `<Module>.<Feature>` for form, lookup and permission keys. Is that the convention you would recommend for third-party modules?

**Packaging and the client side**

4. Each module ships Razor views and ESM bundles as static web assets *and* an npm package with the same classes. A page bundle that imports `@bizeka/extensions` gets its own copy of the classes. Is there a recommended way for third-party module bundles to share code (externals, a shared chunk, import maps)?
5. Sergen generates `ServerTypes` per module with `RootNamespace` set to the module. Is that the intended setup for a library, and is `noImplicitAny: false` for generated service callbacks acceptable or avoidable?
6. Is depending on `Serenity.Extensions` from a library a good idea, or should modules depend only on `Serenity.Net.Web` and `Serenity.Corelib`?

**Data**

7. Modules share the host's `Default` connection and FluentMigrator `VersionInfo` table, with `YYYYMMDD_HHMM` version numbers. Is there a better pattern for module migrations (a separate connection key, a version prefix per module)?
8. `JsonDataRow` stores dynamic field values in one JSON text column, and saving writes only fields in the current schema, so values of fields removed from a definition are dropped on the next save. Does Serenity have, or recommend, a different approach to user-defined fields?
9. Todo's visibility filter uses `Criteria.Exists` with a raw SQL subquery and an embedded, validated integer, because a separate query's parameters are not merged. Is there a parameterized way to express this?

**Security**

10. Is a lookup script with `Permission = "?"` (any signed-in user) acceptable for form schemas, or should module schemas be delivered differently?
11. OnlineChat keeps presence and rate limits in process memory. Is there a Serenity-friendly pattern for SignalR hubs in multi-instance deployments that we should follow?

**Release**

12. Would you see any problem with publishing these under the `Bizeka.*` NuGet and `@bizeka` npm names, MIT licensed, and describing them as "modules for Serenity"? Is there anything you would like us to state about the relationship to Serenity?
13. We plan to move to Serenity 10.6.0 together with our other products ([ADR 0003](adr/0003-coordinated-serenity-upgrade.md)). Is there anything in 10.6.0 or later that these modules should prepare for now?

## Known limitations

- Serenity 10.6.3 no longer brings ImageSharp; the strict dependency audit passes without suppressions.
- OnlineChat is a preview: no tenant boundary, single-instance presence, no Redis backplane.
- Serenity's own pager input, date button and Select2 filter have no accessible name, which we cannot fix in a module. On phones the theme keeps full-page grids fixed to the screen with the rows scrolling inside the grid, which differs from Serene's default.
- Seeded rows (Todo priorities and statuses, the chat room `General`, Dynamic Forms definitions, Northwind data) stay in the language they were stored in.
- No module is used by a customer yet. Oracle is not supported. The CI workflow (guards, Windows and Linux builds, tests on PostgreSQL, SQL Server and MySQL) passes on `main`; earlier local runs are recorded in the public gate evidence.

The release criteria and their current evidence are in [public-gate.md](release/public-gate.md); changes are listed in the [changelog](../CHANGELOG.md).
