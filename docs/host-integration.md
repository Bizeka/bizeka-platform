---
status: active
scope: platform
version: 1
last_reviewed: 2026-10-30
---

# Adding the modules to a Serene 10.6.3 host

Step-by-step setup of every Platform module in a new Serene 10.6.3 application, module by module: what to add to the project, `Startup.cs`, `ScriptInit.ts`, the layout and `appsettings.json`, and how to check that it works. Verified on 2026-10-30 against a blank Serene 10.5.2 host built from the template with all six modules; not yet repeated on 10.6.3. What the modules assume about the host (database, identity, tenancy, files) is in the [host contract](host-contract.md).

## Before you start

- A Serene 10.6.3 application (`dotnet new serene`), .NET 10, Node 24.
- The packages: until the registry packages are published, a local NuGet feed and the npm tarballs built by `tools/Test-Packages.ps1`, or project references to a checkout of this repository. Serenity packages are on 10.6.3; the host also references SkiaSharp for image uploads, as the Serene 10.6.3 template does.
- Serene already scans every assembly of its type source for migrations (`DataMigrations.cs`, `ScanIn(typeSource.GetAssemblies())`) and discovers rows, endpoints, pages, lookups, navigation and texts through MVC application parts. The modules rely on both; nothing else has to be registered for discovery, except the Theme (see below).

## 1. Packages (all modules)

Add the NuGet packages you need to the host project:

```xml
<PackageReference Include="Bizeka.Extensions" Version="0.1.3-alpha" />
<PackageReference Include="Bizeka.DynamicForms" Version="0.1.3-alpha" />
<PackageReference Include="Bizeka.Todo" Version="0.1.3-alpha" />
<PackageReference Include="Bizeka.OnlineChat" Version="0.1.3-alpha" />
<PackageReference Include="Bizeka.Theme" Version="0.1.3-alpha" />
<PackageReference Include="Bizeka.Demo" Version="0.1.3-alpha" />
```

Serene restores the client side of each NuGet package into `node_modules/.dotnet/<package id in lower case>` (`dotnet build -target:RestoreNodeTypes`, run by `npm install`). Add the matching entries to the host's `package.json`, in the same form as the Serenity entries already there, then run `npm install`:

```json
"@bizeka/extensions": "./node_modules/.dotnet/bizeka.extensions",
"@bizeka/dynamicforms": "./node_modules/.dotnet/bizeka.dynamicforms",
"@bizeka/todo": "./node_modules/.dotnet/bizeka.todo",
"@bizeka/onlinechat": "./node_modules/.dotnet/bizeka.onlinechat",
"@bizeka/theme": "./node_modules/.dotnet/bizeka.theme",
"@bizeka/demo": "./node_modules/.dotnet/bizeka.demo"
```

The packages declare their dependencies between each other (DynamicForms and Todo use Extensions; Todo uses DynamicForms; Demo uses all of them). Each module's pages load their own script bundles; the host only imports a module in `ScriptInit.ts` when this page says so.

## 2. Extensions

Editors, formatters and JSON dialogs used by the other modules and by your own forms.

| Where | What |
| --- | --- |
| Startup | Nothing |
| ScriptInit | Nothing. Import from `@bizeka/extensions` in the module that uses an editor or formatter, so its registration runs |
| Layout | Nothing |
| Database | None |

Check: an entity form with `[ColorPickerEditor]` on a string property shows the color editor.

## 3. Dynamic Forms

Extra fields on existing Serenity dialogs, defined at runtime and stored as JSON.

| Where | What |
| --- | --- |
| Startup | Nothing |
| ScriptInit | Nothing |
| Layout | Nothing |
| Database | Table `DynamicFormDefinitions` (migration in the module, `DefaultDB` tag) |
| Permissions | `DynamicForms:General` to read definitions, `DynamicForms:Manage` to edit them |

Check: after the host starts, the table exists, and **Dynamic Forms > Form Definitions** opens for a user with `DynamicForms:Manage`.

## 4. Todo

Tasks with priorities, statuses, multiple assignees and per-user visibility.

| Where | What |
| --- | --- |
| Startup | `using Bizeka.Todo;` and `services.AddBizekaTodo();` in `ConfigureServices` |
| ScriptInit | Nothing |
| Layout | Nothing |
| Database | Tables `TaskItems`, `TaskPriorities`, `TaskStatuses`, `TaskAssignees`, with seed priorities and statuses |
| Permissions | `Todo:TaskItems:View`, `:Create`, `:Update`, `:Delete`; `Todo:TaskPriorities:View`, `:Modify`; `Todo:TaskStatuses:View`, `:Modify` |

Check: **Todo > Tasks** lists tasks; a task is visible only to its creator, assigner and assignees.

## 5. Online Chat (preview)

Rooms and messages over SignalR. Not part of the 1.0 scope; see the module README for its limits.

| Where | What |
| --- | --- |
| Startup, services | `using Bizeka.OnlineChat;` and `services.AddBizekaOnlineChat(Configuration);` (it also calls `AddSignalR`) |
| Startup, endpoints | `endpoints.MapBizekaOnlineChatHubs();` inside `UseEndpoints`, which maps the hub at `/chathub` |
| ScriptInit | Optional floating chat button on every page: `import { initializeOnlineChat } from "@bizeka/onlinechat";` then `initializeOnlineChat();` |
| Styles | The script entry carries no styles: `import "@bizeka/onlinechat/styles.css";` wherever the chat panel is shown |
| appsettings | Optional `OnlineChatSignalR` section: `MessagesPerWindow` (default 30), `SendWindowSeconds` (default 60) |
| Database | Tables `ChatRooms`, `ChatRoomMembers`, `ChatMessages` and one public room |
| Permissions | `OnlineChat:General` for rows and the hub |

```csharp
// Startup.ConfigureServices
services.AddBizekaOnlineChat(Configuration);

// Startup.Configure
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapBizekaOnlineChatHubs();
});
```

Check: open **Online Chat** in two browsers as two users; a message sent with Enter appears in both.

## 6. Theme

Light, dark and system modes with one accent color, as an override layer over Serene's own styles, and a light / dark / system menu in the header.

| Where | What |
| --- | --- |
| Startup | `using Bizeka.Theme;` and `services.AddBizekaTheme();`. The Theme has no controllers, so MVC does not list it as an application part on its own; this call adds it, and Serenity then finds its local texts (the menu labels) |
| Layout head | After `@Html.StyleBundle("Base")` in `Views/Shared/_LayoutHead.cshtml`: `<script src="@Html.ResolveWithHash("~/_content/Bizeka.Theme/bizeka-theme/bizeka-theme-init.js")" nonce="@nonce"></script>` and `<link rel="stylesheet" href="@Html.ResolveWithHash("~/_content/Bizeka.Theme/bizeka-theme/bizeka-theme.css")" />`. Keep the script a plain one, without `defer` or `type="module"`: it applies the saved mode before the first paint, so a saved dark mode does not flash light on each page |
| Layout root | On the `<html>` element of `_Layout.cshtml` (and `_LayoutNoNavigation.cshtml`): `data-bizeka-theme="bizeka" data-bizeka-mode="system"`, so the theme also applies if the script is blocked |
| ScriptInit | `import { initBizekaTheme } from "@bizeka/theme";` then `initBizekaTheme();` |
| Database | None |

`initBizekaTheme()` applies the saved mode and accent, follows operating-system changes while the mode is "system", and adds the mode menu to Serene's header actions (`.s-sidebar-header-actions`), before the language and user menus. Pass `{ headerToggle: false }` to skip the menu, or `{ targetSelector: "..." }` for a custom header. The stylesheet also makes the sidebar menu scroll inside its pane, so long menus stay reachable.

```ts
// Modules/Common/ScriptInit.ts
import { initBizekaTheme } from "@bizeka/theme";

initBizekaTheme();
```

Check: the header shows a monitor icon; its menu switches light, dark and system, the choice survives a reload, moving between pages in dark mode shows no light flash, and with all sidebar groups open the menu scrolls.

## 7. Demo

Optional sample pages under `~/Demo/`, in the style of Serenity's BasicSamples, with the source of each sample next to it.

| Where | What |
| --- | --- |
| Startup | Nothing |
| ScriptInit | Nothing |
| Database | One example Dynamic Forms definition for the Northwind customer form (migration in the module) |
| Dependencies | The Northwind sample needs `Serenity.Demo.Northwind`, which Serene's template already references |

Check: the **Bizeka Samples** menu lists the samples; **Source files** under each sample shows its code.

## Summary of host changes

| File | Change |
| --- | --- |
| `*.csproj` | Package references (section 1) |
| `package.json` | `@bizeka/*` entries (section 1) |
| `Initialization/Startup.cs` | `AddBizekaTheme()`, `AddBizekaTodo()`, `AddBizekaOnlineChat(Configuration)`, `MapBizekaOnlineChatHubs()` |
| `Modules/Common/ScriptInit.ts` | `initBizekaTheme()`; optionally `initializeOnlineChat()` |
| `Views/Shared/_LayoutHead.cshtml` | Theme init script and stylesheet link |
| `Views/Shared/_Layout.cshtml`, `_LayoutNoNavigation.cshtml` | `data-bizeka-theme` and `data-bizeka-mode` on `<html>` |
| `appsettings.json` | Optional `OnlineChatSignalR` section |
| Roles | The permission keys of sections 3 to 5 |
