---
status: accepted
scope: repository
version: 2
date: 2026-11-16
---

# ADR 0003 - Coordinated Serenity upgrade (done: 10.6.3)

## Decision

Version 1 of this record (2026-10-22) kept Platform on Serenity and Sergen 10.5.2 and deferred the upgrade, including the ImageSharp-to-SkiaSharp change, to a coordinated packet. On 2026-11-16 the owner approved moving Platform to Serenity 10.6.3, replacing that deferral. Platform now uses:

- Serenity NuGet packages and Sergen 10.6.3;
- `@serenity-is/corelib`, `domwise`, `sleekgrid`, `extensions` (and `demo.northwind` in Demo) and `@serenity-is/tsbuild` 10.6.3;
- TypeScript 7.0.2. Serenity 10.6.3 pins the TypeScript 7.0.1 compiler for its templates; 7.0.1 is not published on npm, so the nearest 7.0 patch is used.

## Changes required by the upgrade

- Serenity 10.6.x no longer references SixLabors.ImageSharp; image handling uses SkiaSharp, which the host references (the Serene 10.6.3 template adds `SkiaSharp` and `SkiaSharp.NativeAssets.Linux.NoDependencies` 4.153.1). No Platform module processes images itself, so no Platform code referenced ImageSharp. The five ImageSharp `NuGetAuditSuppress` entries are removed and the strict dependency audit passes.
- `Size(-1)` is rejected by Serenity 10.6 (`SizeAttribute` throws for negative values). The three JSON text fields (DynamicForms definition, Extensions `JsonDataRow`, Todo task dynamic data) drop the attribute; size 0 already means no length limit.
- TypeScript 7 removes `baseUrl` (Demo and OnlineChat tsconfig; paths are already relative), needs an explicit `rootDir` for declaration output (Demo and OnlineChat package tsconfig, set to `./Modules` so the `dist` layout is unchanged) and checks side-effect imports (Demo sets `noUncheckedSideEffectImports: false`, as the Serene 10.6.3 tsconfig does, for CSS imports).
- Sergen 10.6.3 adds a `Namespaces.ts` per module and the `undeletePermission` row member; both are generated output.
- `Microsoft.Data.Sqlite` and `System.Security.Cryptography.Pkcs` move to 10.0.14, the minimum required by Serenity.Extensions 10.6.3 under central package management.

## Remaining acceptance work

1. Exercise image uploads, resize/thumbnail generation, validation and hostile/oversized inputs in a real host with its SkiaSharp native runtime on each deployment platform.
2. The Commercial repository moves to 10.6.3 in its own change; Platform packages built on 10.6.3 require consuming hosts on 10.6.3.
3. Review the 10.6.0/10.6.1 breaking changes (fail-closed permissions, `TextKey` for key-like `Hint`/`Placeholder`/`Tab`/`InstanceName`, `IDataMigrations` moved into Serenity.Extensions, icon CSS variables) against each consuming host.

## Consequences

The temporary ImageSharp development exception is retired. Build, tests, generators, package and consumer checks and the strict audit pass locally (see `docs/release/public-gate.md`, Serenity 10.6.3 section). Public-release readiness still depends on the other ADR 0001 criteria.