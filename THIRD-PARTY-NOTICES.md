# Third-party notices

Direct and key dependencies used across `bizeka-platform` modules (`Bizeka.Extensions`, `Bizeka.DynamicForms`, `Bizeka.Todo`, `Bizeka.OnlineChat`, `Bizeka.Theme`):

| Package | Version | License | Module(s) |
| --- | --- | --- | --- |
| Serenity.Corelib | 10.6.3 | MIT | All |
| Serenity.Extensions | 10.6.3 | MIT | All |
| Serenity.Net.Web | 10.6.3 | MIT | All |
| @serenity-is/corelib | 10.6.3 | MIT | All |
| @serenity-is/domwise | 10.6.3 | MIT | Extensions, DynamicForms, Todo, Theme |
| @serenity-is/extensions | 10.6.3 | MIT | Extensions, DynamicForms, Todo, OnlineChat |
| @serenity-is/sleekgrid | 10.6.3 | MIT | Extensions, DynamicForms, Todo |
| @serenity-is/tsbuild | 10.6.3 | MIT | All |
| @microsoft/signalr | 10.0.x | MIT | OnlineChat |
| FluentMigrator | 8.0.1 | Apache-2.0 | DynamicForms, Todo, OnlineChat |
| esbuild | 0.28.x (Extensions, DynamicForms, OnlineChat, Theme), 0.25.x (Todo, Demo) | MIT | All |
| TypeScript | 7.0.2 | Apache-2.0 | All |
| Vitest | 5.0.5 | MIT | Extensions, DynamicForms |
| jsdom | 30.1.x | MIT | Extensions, DynamicForms |
| xUnit | 2.9.x | Apache-2.0 | Tests |
| Moq | 4.21.x | BSD-3-Clause | Tests |
| Serenity.Demo.Northwind | 10.6.3 | MIT | Demo |
| FluentMigrator.Runner.SQLite/Postgres/SqlServer/MySql | 8.0.1 | Apache-2.0 | Integration tests |
| Microsoft.Data.Sqlite | 10.0.13 | MIT | Integration tests |
| SQLitePCLRaw.lib.e_sqlite3 | 2.1.13 | Apache-2.0 (package); public domain (SQLite engine) | Integration tests |
| Npgsql | 10.0.3 | PostgreSQL | Integration tests |
| Microsoft.Data.SqlClient | 7.1.1 | MIT | Integration tests |
| MySqlConnector | 2.6.2 | MIT | Integration tests |
| Microsoft.NET.Test.Sdk | 18.11.0 | MIT | Tests |
| xunit.runner.visualstudio | 2.8.2 | MIT | Tests |

License metadata was checked against the upstream package manifests or package metadata. The dependency lockfile records exact resolved versions.

## Security-relevant transitive dependencies

| Package | Version | License | Notes |
| --- | --- | --- | --- |
| System.Security.Cryptography.Pkcs | 10.0.13 | MIT | Centrally pinned for all affected projects |

This inventory identifies direct and selected transitive dependencies; it is not a complete license clearance. Before public release, review every resolved package and retain any required upstream copyright and NOTICE material. npm tarballs and NuGet archives include this notice and the current repository LICENSE.
