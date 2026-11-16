# Bizeka.Todo

[![Serenity](https://img.shields.io/badge/Platform-Serenity-success.svg)](https://github.com/serenity-is/Serenity)

Open source Serenity todo/task management module by Bizeka. This project is part of the **Bizeka Platform** and is an MIT-licensed alpha release ([license](../../LICENSE)).

This package uses:

- module name: `Todo`
- connection key: `Default`
- tables: `TaskItems`, `TaskPriorities`, `TaskStatuses`

The domain entity is intentionally named `TaskItem` so the package name `Bizeka.Todo` does not collide with a `TodoRow` / `Todos` naming chain.

## Architecture & Features
See the [ARCHITECTURE.md](ARCHITECTURE.md) and [FEATURE_MATRIX.md](FEATURE_MATRIX.md) for more details on design and capabilities.

## Integration in a Serene 10.6.3 Host

The package commands below describe the intended package names. NuGet/npm packages coming soon; until then, use the locally built NuGet feed and npm tarballs. Restore Serenity framework packages through the host before installing the module. See the [repository setup](../../README.md).

### 1. Install Packages
**NuGet (Backend):**
```bash
dotnet add package Bizeka.Todo
```

**NPM (Frontend):**
```bash
npm install @bizeka/todo
```

### 2. Dependency Injection and Configuration

In your `Startup.cs` or `Program.cs`, ensure that Serenity type discovery includes `Bizeka.Todo`.

```csharp
services.AddBizekaTodo();
```

The extension registers the task application service. Keep business rules inside the module.
The host supplies the standard Serenity user lookup, authentication, permissions and migration runner.
Tasks are visible to their creator, assigning user and assigned users. A username does not grant task access.

TR: Host yalnızca `AddBizekaTodo()` ile servisi kaydeder; iş kuralları modülde kalır.
Görevleri oluşturan, atayan ve atanan kullanıcılar görebilir. Kullanıcı adı erişim sağlamaz.

### 3. Database Migrations

`Bizeka.Todo` requires `TaskItems`, `TaskPriorities`, and `TaskStatuses` tables on a connection key named `Default`. Ensure you have this connection defined in your `appsettings.json` and run its FluentMigrator migrations:

```csharp
// In your FluentMigrator runner configuration:
.ScanIn(typeof(Bizeka.Todo.TaskItemRow).Assembly).For.Migrations()
```

## Contributing & License

Released under the [MIT license](../../LICENSE). This is an alpha (`0.1.3-alpha`), not production-certified; see the [public gate](../../docs/release/public-gate.md).
For contribution guidelines, code of conduct, and reporting issues, please refer to the root `bizeka-platform` repository documentation.
