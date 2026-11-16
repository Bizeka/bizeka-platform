# Bizeka Platform

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Status: alpha](https://img.shields.io/badge/status-0.1.3--alpha-orange.svg)
![Serenity 10.6.3](https://img.shields.io/badge/Serenity-10.6.3-informational.svg)
![.NET 10](https://img.shields.io/badge/.NET-10-512bd4.svg)

Bizeka Platform is a set of reusable, open source (MIT) modules for [Serenity](https://serenity.is) 10.6.3 applications on .NET 10: editors and formatters, dynamic forms, a todo module, room-based chat and a light/dark theme, plus a BasicSamples-style demo. The current release is `0.1.3-alpha`.

These packages are add-on modules for Serenity: they extend a Serenity host (Serene or your own application) and do not replace or fork the framework. Bizeka Platform is an independent project and is not an official Serenity product.

## Quick start

1. Clone the repository and build it (prerequisites under [Develop](#develop)):

   ```powershell
   ./tools/Initialize-Dependencies.ps1
   dotnet build Bizeka.Platform.slnx -c Release --no-restore -m:1
   ./tools/Test-Packages.ps1
   ```

2. Use the archives under `artifacts/packages` as a local NuGet feed and npm tarballs in a Serene 10.6.3 host. NuGet/npm packages coming soon.
3. Follow [adding the modules to a Serene host](docs/host-integration.md) and [the host contract](docs/host-contract.md).

## Modules

| Module | Responsibility | Host integration |
| --- | --- | --- |
| [Extensions](src/bizeka.extensions/README.md) | Editors, formatters and JSON dialog infrastructure | Serenity type discovery; npm imports |
| [DynamicForms](src/bizeka.dynamicforms/README.md) | Definition authoring and JSON field rendering | Default database migrations, type discovery, definition permissions |
| [Todo](src/bizeka.todo/README.md) | Tasks, priorities, statuses and assignment visibility | `services.AddBizekaTodo()`, Default migrations, user lookup and permissions |
| [OnlineChat](src/bizeka.onlinechat/README.md) | Room-based messaging and process-local presence | `AddBizekaOnlineChat(configuration)`, `MapBizekaOnlineChatHubs()`, Default migrations |
| [Theme](src/bizeka.theme/README.md) | Semantic color tokens, light/dark preset and runtime helper | CSS after Serenity styles; optional npm helper |
| [Demo](src/bizeka.demo/README.md) | BasicSamples-style samples for every module | A consuming Serene host and the modules above |

Reviewers start with [the reviewer guide](docs/reviewer-guide.md): architecture, how to run the modules in a Serene host, and open questions.

This solution contains libraries, not a standalone web application. A host supplies authentication, permissions, database connections, migration execution, static assets and HTTP security controls. No production secrets are needed to build or run the included tests. See [adding the modules to a Serene host](docs/host-integration.md) for the setup steps, [the host contract](docs/host-contract.md) for exactly what a host must provide, and [SECURITY.md](SECURITY.md) for deployment boundaries.

## Develop

Prerequisites: Git, .NET SDK 10.0.100 or a compatible .NET 10 feature band (`global.json`), Node.js 24, npm, PowerShell 7.6 and Docker for optional provider tests. Sergen is pinned to 10.6.3. Commands run from the repository root on Linux or Windows:

```powershell
./tools/Initialize-Dependencies.ps1
dotnet build Bizeka.Platform.slnx -c Release --no-restore -m:1
dotnet test Bizeka.Platform.slnx -c Release --no-build --no-restore
./tools/Test-RepoGuards.ps1 -Root . -Strict
./tools/Update-TextTemplates.ps1 -Check
./tools/Update-ServerTypes.ps1 -Check
npm --prefix src/bizeka.extensions test
npm --prefix src/bizeka.dynamicforms test
npm --prefix src/bizeka.theme run test:theme:strict
```

Frontend framework packages are restored from the pinned Serenity NuGet packages into `node_modules/.dotnet`. npm performs frozen installs, then the initialization script restores those files again because `npm ci` removes them. Do not substitute unrelated Serenity registry versions, use `--legacy-peer-deps`, or edit lockfiles to resolve setup failures. Regenerate typings with the pinned tool; never hand-edit generated output.

Provider tests create disposable local containers and databases, then clean up their container:

```powershell
./tools/Test-Provider.ps1 -Provider Postgres
./tools/Test-Provider.ps1 -Provider SqlServer
./tools/Test-Provider.ps1 -Provider MySql
```

The SQL Server job exercises the 2012 dialect against a SQL Server 2022 runtime; it does not certify the 2012 runtime. Oracle is deferred for Platform and related products until a suitable test environment exists; it is outside the current release matrix. SQLite is a fast local test target, not a certified production provider.

## Prepare local packages

```powershell
./tools/Test-Packages.ps1
./tools/Test-NpmConsumer.ps1
./tools/Test-PackageConsumer.ps1
./tools/Test-Dependencies.ps1
```

Archives are written under `artifacts/packages`; nothing is published. The consumer check restores all six NuGet modules into a fresh host, resolves module services and requests a packaged theme stylesheet. The strict dependency audit passes with no suppressions since the Serenity 10.6.3 upgrade. See [the release evidence](docs/release/public-gate.md) for other outstanding requirements.

NuGet/npm packages coming soon; until then they are not on public registries. For development, use the local NuGet archive directory as a feed and install the generated npm tarballs into an existing Serene 10.6.3 host whose framework dependencies are restored from NuGet. Do not copy the Platform source into a consuming product. See [versioning and publication](docs/release/versioning.md).

## Known limitations

- Alpha: APIs, schemas and package names may change before 1.0; this release is not production-certified (see [the public gate](docs/release/public-gate.md)).
- Providers: PostgreSQL, SQL Server and MySQL are tested; Oracle is deferred; SQLite is a test target only.
- Serenity 10.6.3 moved image processing to SkiaSharp: the consuming host must reference SkiaSharp and its native assets.
- OnlineChat presence is process-local; multi-instance hosts and a Redis backplane are unsupported.
- Packages are not yet on nuget.org or npmjs.com.

## Documentation

[Reviewer guide](docs/reviewer-guide.md) · [Host integration](docs/host-integration.md) · [Host contract](docs/host-contract.md) · [Versioning](docs/release/versioning.md) · [ADRs](docs/adr) · [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Support](SUPPORT.md) · [License](LICENSE)

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md), [the code of conduct](CODE_OF_CONDUCT.md), [third-party notices](THIRD-PARTY-NOTICES.md) and [security reporting](SECURITY.md). Technical documentation and code are English; user-facing feature documentation includes Turkish and English.

## Acknowledgments

A special thanks to the team behind **[Serenity](https://github.com/serenity-is/serenity)**, and above all to **[Volkan Ceylan](https://github.com/volkanceylan)**, its creator and lead maintainer. Every module here stands on Serenity's row, service and dialog model, its Sergen code generator and its frontend packages [corelib](https://github.com/serenity-is/serenity/tree/master/packages/corelib), [domwise](https://github.com/serenity-is/serenity/tree/master/packages/domwise) and [sleekgrid](https://github.com/serenity-is/serenity/tree/master/packages/sleekgrid). Years of careful, open work on Serenity made a module set like this possible. Thank you.

TR: Platform, MIT lisanslı altı yeniden kullanılabilir modülden oluşur; çalıştırılabilir bir host içermez. Geliştirme için yukarıdaki kurulum ve test komutlarını kullanın. Bu sürüm alfadır ve üretim için sertifikalı değildir; NuGet/npm paketleri yakında yayımlanacaktır.
