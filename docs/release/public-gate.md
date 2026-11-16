---
status: active
scope: repository
version: 2
last_reviewed: 2026-11-16
---

# Public-release evidence

## Owner decision: public alpha (2026-11-16)

The owner decided on 2026-11-16 to release the repository publicly under the MIT license as `0.1.3-alpha` ([ADR 0001](../adr/0001-production-ready-gate.md)). The public repository is created from a clean, history-free snapshot authored as `Bizeka <platform@bizeka.com>`. The release is an alpha: it is **not** production-certified, and the criteria below remain the bar for `1.0.0-rc`. Registry publication (nuget.org, npmjs.com) waits for the owner's registry keys.

### Status of each criterion at the public alpha (2026-11-16)

| Criterion | Status at 0.1.3-alpha |
| --- | --- |
| 1. Clean Windows and Linux build with TypeScript | Met locally on Windows (Serenity 10.6.3, 0 warnings); the Linux CI run on the release commit is still to be recorded |
| 2. Provider matrix (SQL Server, PostgreSQL, MySQL) | Met locally (Docker, 2026-11-16); Oracle deferred, not claimed |
| 3. Sergen twice, zero diff | Met locally with Sergen 10.6.3 |
| 4. Guards, security header scan, dependency scan | Guards and strict dependency audit met; HTTP header scan not met (libraries only, the host owns headers) |
| 5. README, CONTRIBUTING, SECURITY, LICENSE (MIT), notices, versioning | Met: full MIT LICENSE, MIT package metadata, SUPPORT.md added |
| 6. Used in a real customer solution as versioned packages | Not met |
| 7. History scanned for secrets, customer names, paths, licensed content | Met for the snapshot by construction (no history) and a gitleaks scan; licensed-source provenance review is the owner's responsibility |
| 8. `1.0.0-rc` reached | Not met: `0.1.3-alpha` |

## Earlier evidence

The sections below record the evidence collected before the decision; their "pending MIT" and "private" wording describes that time.

## ADR 0001 criteria

| Criterion | Status | Evidence or remaining action |
| --- | --- | --- |
| Clean Windows and Linux build, including TypeScript | Partial (Windows local evidence 2026-10-22 below; no CI yet) | Standard restore and full Release build passed on Linux with 0 warnings/errors. Repeated from a clean local clone with the exact pending source changes and no copied node_modules/bin/obj/dist outputs. Windows is configured in CI but was not executed here. |
| PostgreSQL, SQL Server and MySQL matrix | Partial | PostgreSQL 17 and MySQL 8.4 each passed two integration tests, including migrations twice and authorization/data boundaries. SQL Server 2022 image retrieval failed with HTTP Forbidden in this cloud environment; direct registry reads succeeded, but the Docker pull remained blocked after a diagnosed retry. CI must complete that provider. SQLite integration also passed locally. Update 2026-10-22: all three providers, SQL Server 2022 included, passed locally on Windows at `0fdc2ef` (see local evidence below); CI confirmation pending. |
| Sergen twice, second run unchanged | Passed locally | Pinned Sergen 10.5.2 (10.6.3 since 2026-11-16, also idempotent) ran after fixing assembly-copy prerequisites and duplicate DynamicForms barrel inputs. Subsequent `Update-ServerTypes.ps1 -Check` passed, including in the clean clone. No generated type was hand-edited. |
| Guards, headers and vulnerability scan | Partial / blocked | Strict repository guards passed. Extensions npm audit is clean after the runner upgrade; the strict audit completed for all modules. Update 2026-11-16: after the Serenity 10.6.3 upgrade ImageSharp is no longer resolved, its suppressions are removed and the strict audit passes. Host HTTP headers were not certified: the selected repositories contain libraries, not the real application hosts. |
| Public documentation and full MIT license | Prepared / pending | README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, third-party notices, changelog and version policy are present. The pending-MIT LICENSE is deliberately retained until the full gate is satisfied. Archives include that actual license; npm is marked private. Review complete dependency notices/provenance and enable private vulnerability reporting before public release. |
| Real customer uses versioned packages | Unmet | The owner confirmed that no real customer solution uses the packages yet. Host templates reportedly exist in the separate product repository; that checkout was unavailable and was not verified. |
| Full-history secret/provenance review | Partial | Gitleaks 8.24.3 scanned all 16 commits in the non-shallow history and a source-only snapshot of the pending files with redaction enabled: no leaks found. A current source path scan found no committed machine-local paths outside generated outputs. Automated secret detection is not copyright, customer-name or licensed-source provenance clearance; the owner must complete that review. |
| Reach 1.0.0 release-candidate | Not issued | Current versions remain 0.1.3-alpha. Do not raise the version to imply the unmet gate has passed. Follow versioning.md for the owner-approved coordinated release. |

Oracle is deferred for Platform and related products until a suitable test environment exists. Per the owner's 2026-10-22 clarification, it is outside the current release matrix, not an unmet release criterion. No Oracle support or certification is claimed.

## Additional verified capabilities

- All five remaining backend test projects passed: **11 tests**, including SQLite integration. The old Theme project containing only `Assert.True(true)` was removed; it is not counted as readiness evidence.
- Extensions frontend: **42 tests in 16 files**, passing with Vitest 5.0.5.
- Theme: all five strict check groups passed (contract, CSS hygiene, components, 12 contrast pairs, deterministic light/dark SVG snapshots).
- Text-template check passed for all six modules.
- All six NuGet archives and six npm tarballs were created and checked for version alignment, license/notices/README, entry points and package contents. NuGet developer configuration no longer overwrites consuming host files.
- The npm consumer extracted actual tarballs, resolved all six public declaration entry points with TypeScript, and bundled their JavaScript with the host-provided framework dependencies externalized.
- A fresh .NET host restored actual local NuGet archives into an isolated package cache, loaded all six assemblies, resolved Todo/chat services, and served the packaged Theme stylesheet and its token stylesheet over HTTP. This is a package-integration smoke test, not acceptance coverage of business screens or host security policy.
- PowerShell scripts and workflow YAML passed local parsing checks. GitHub Actions are pinned to verified revisions; the secret-scanner image is pinned by digest. CI artifacts are local-review packages, with no automatic registry publication.

## Decisions and next gates

1. Serenity and Sergen are on 10.6.3 (owner approval 2026-11-16, [ADR 0003](../adr/0003-coordinated-serenity-upgrade.md)). ImageSharp is gone from the dependency graph and its suppressions are removed; do not add suppressions to make the release audit appear clean. Image upload handling with SkiaSharp is still to be exercised in a real host.
2. Run the updated Windows/Linux CI matrix, SQL Server provider and `release-check` workflow on the reviewed commit. The strict dependency audit is expected to pass.
3. In the real consuming hosts, validate module screens, permissions/tenancy, upload handling, security headers and production configuration. Host templates or the minimal package-consumer host do not satisfy actual customer-use evidence.
4. Finish dependency/source license clearance and the remaining external gate criteria. Only then change the license/private flags, assign the agreed release version and publish through the authorized process.

## Local evidence: Windows (2026-10-22)

Commit `b16ba70`, Windows 11, PowerShell 7.6.7, .NET SDK 10.0.401, Node 24, short checkout path. Local evidence, not CI.

- Frozen install, Release build (0 warnings, 0 errors), 11 backend tests, 42 Extensions tests, Theme strict suite, guards, text-template and server-type checks: passed.
- `Test-Packages.ps1` (six NuGet and six npm archives) and `Test-NpmConsumer.ps1`: passed.
- `Test-PackageConsumer.ps1`: fails on Windows with `NU1301` because the local feed and nuget.org are passed as repeated `--source` values; passed after writing them to a `nuget.config` in a scratch checkout (fixed in the next run below).
- `Test-Dependencies.ps1`: fails on the ImageSharp advisories only, as expected.
- After the build, four `.js.map` files differ only by CRLF in `sourcesContent`.
- Provider matrix: not run on Windows.

## Local evidence: full local CI (2026-10-22, `0fdc2ef`)

Fresh detached checkout of `0fdc2ef` (no generated output), Windows 11, PowerShell 7.6.7, .NET SDK 10.0.401, Node 24.19, Docker 29.8. Every step of `ci.yml` plus the provider matrix and the strict release audit. Local evidence, not CI.

| Step | Result |
| --- | --- |
| Guards, frozen install, Release build | Passed (0 warnings, 0 errors) |
| `dotnet test` | 24 passed: Todo 5, Extensions 1, DynamicForms 1, OnlineChat 9, Integration 8 (SQLite) |
| Text templates, server types (`-Check`) | Passed |
| Extensions Vitest, Theme strict suite | 42 passed, passed |
| `Test-Packages.ps1` | Six NuGet and six npm archives verified, including every built page bundle |
| `Test-NpmConsumer.ps1`, `Test-PackageConsumer.ps1` | Passed (the Windows restore fix is now committed) |
| Working tree after build and generators | Clean |
| `Test-Provider.ps1` PostgreSQL 17, SQL Server 2022, MySQL 8.4 | Passed: integration suite including per-module installation, repeat no-op migrations, demo isolation and the active-only lookup |
| `Test-Dependencies.ps1` | Fails on SixLabors.ImageSharp 2.1.13 only (12 projects), as expected until the coordinated upgrade |

The first run on `fa0f254` found two defects that are fixed in this commit: missing regenerated server types after a new local text, and the Theme bundle packed at a doubled `esm/esm` path.

## Local evidence: dependency updates (2026-10-22)

Dependabot PRs verified with the full local CI on Windows (same environment as above). Passed together: #9 Microsoft.Data.SqlClient 7.1.1, #10 Microsoft.Data.Sqlite 10.0.13, #11 Microsoft.NET.Test.Sdk 18.11.0, #12 Moq 4.21.0, #16 jsdom 30.1.3, #17 @microsoft/signalr 10.0.11, #19 and #21 esbuild 0.28.2; every step including the three providers passed, and the strict audit still fails on ImageSharp only. Rejected: #15, #18, #20 TypeScript 7.0.2 (build fails with TS5102, `baseUrl` removed) and #22 Sergen 10.6.0 (ADR 0003). GitHub Action upgrades #5 to #8 cannot be verified locally and wait for CI. SignalR 10 is verified by build, bundle and package checks only; a live chat session against a host is still to be exercised.

Local reproducible commands are in the root README. Detailed command logs and intermediate artifacts are retained outside the source checkout in the cloud setup workspace; CI regenerates its own evidence and package artifacts.

## Local evidence: demo showcase (2026-10-24, `545d319`)

Full local CI on Windows 11, PowerShell 7.6.7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI.

| Step | Result |
| --- | --- |
| Guards, frozen install, Release build | Passed (0 warnings, 0 errors) |
| `dotnet test` | 25 passed: Todo 5, Extensions 1, DynamicForms 1, OnlineChat 9, Integration 9 (SQLite, including the demo sample catalog) |
| Text templates, server types (`-Check`) | Passed |
| Extensions Vitest, Theme strict suite | 45 passed, passed |
| `Test-Packages.ps1`, `Test-NpmConsumer.ps1`, `Test-PackageConsumer.ps1` | Passed |
| Working tree after build and generators | Clean |

The 15 samples were opened in a scratch Serene 10.5.2 host built from the template with project references to the modules (SQL Server LocalDB, signed in as `admin`). This exercised SignalR 10 in a live session: a chat message was sent and delivered through the hub. The samples found four Extensions defects, fixed in the same change (formatter exports, `PhoneEditor` validation, `EmptyLookupEditor`, formatter options). Not run: provider matrix (no data-access change), non-admin permission paths.

## Local evidence: M1 follow-ups (2026-10-24, `4930d57`)

`main` after PRs #31 to #35 (text-template load context, neutral module wording, OnlineChat Enter, module-owned `PhoneEditor` text keys, dark-mode alert colors). Fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Each PR also passed the same run on its own branch before merging. Local evidence, not CI.

| Step | Result |
| --- | --- |
| Guards (strict), frozen install, Release build | Passed (0 warnings) |
| `dotnet test` | 25 passed: Todo 5, Extensions 1, DynamicForms 1, OnlineChat 9, Integration 9 (SQLite) |
| Text templates, server types (`-Check`) | Passed |
| Extensions Vitest, DynamicForms Vitest | 45 passed, 1 passed |
| Theme strict suite | Passed, including the new dark-mode alert check |
| `Test-Packages.ps1`, `Test-NpmConsumer.ps1`, `Test-PackageConsumer.ps1` | Passed |
| Working tree after build and generators | Clean |

The OnlineChat, `PhoneEditor` and Theme changes were also exercised in a scratch Serene 10.5.2 host (Enter sent a message through the hub; the new text keys reached the client; `.alert-info` in dark mode measured about 7.6:1). Not run: provider matrix (no data-access change).

## Local evidence: Dependabot #24 and #25 (2026-10-24, on `1e0fd05`)

Each PR merged onto `main` `1e0fd05` in its own fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI; the GitHub checks on both PRs fail only because Actions jobs do not start (account billing).

| PR | Change | Every `ci.yml` step |
| --- | --- | --- |
| #24 | `SQLitePCLRaw.lib.e_sqlite3` 2.1.13 to 3.53.3 (native SQLite builds only; `SQLitePCLRaw.core` stays 2.1.13 through `Microsoft.Data.Sqlite` 10.0.13) | Passed: Release build 0 warnings, `dotnet test` 25 passed including the SQLite integration suite, Vitest 45 and 1, Theme strict, package and consumer checks, clean tree |
| #25 | `xunit.runner.visualstudio` 2.8.2 to 4.0.1 (runs xUnit.net v2 on .NET 8 or later; xunit stays 2.9.3) | Passed: same steps, all 25 tests discovered and run |

Both merged on 2026-10-24; on the resulting `main` `320d9a1` the Release build and `dotnet test` (25 passed) were run again with both updates together. Not run: provider matrix (#24 changes the SQLite test package only; #25 is the test runner, which every `dotnet test` above exercises).

## Local evidence: Dependabot #39 (2026-10-30, on `41d642d`)

`Microsoft.Data.Sqlite` 10.0.13 to 10.0.14 merged onto `main` `41d642d` in a fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI.

Every `ci.yml` step passed: strict guards, frozen install, Release build, `dotnet test` 25 passed including the SQLite integration suite (`SQLitePCLRaw.core` stays 2.1.13 with the pinned native 3.53.3), text templates and server types `-Check`, Extensions Vitest 45, DynamicForms Vitest 1, Theme strict suite, package and consumer checks, clean tree. Both Vitest steps first failed to start a worker ("Timeout waiting for worker to respond", no test executed) while the machine ran at 100% CPU, and passed when rerun without changes. Not run: provider matrix (SQLite test package only).

## Local evidence: demo review fixes (2026-10-30, `45502d5`)

Branch `feat/demo-ux-fixes` on `main` `f2ab159`, fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI.

| Step | Result |
| --- | --- |
| Guards (strict), frozen install, Release build | Passed |
| `dotnet test` | 27 passed: Todo 5, Extensions 1, DynamicForms 1, OnlineChat 9, Integration 11 (SQLite, including the theme application part and the chat sample sources) |
| Text templates, server types (`-Check`) | Passed |
| Extensions Vitest, DynamicForms Vitest | 47 passed (including the color picker sync and the toolbar filter button), 1 passed |
| Theme strict suite | Passed, including the sidebar scroll and checkbox contract checks |
| `Test-Packages.ps1`, `Test-NpmConsumer.ps1`, `Test-PackageConsumer.ps1` | Passed |
| Working tree after build and generators | Clean |

Checked in a scratch Serene 10.5.2 host built from the template with project references (light and dark, 1280x800 and 375x812): the sidebar menu scrolls with every group open; the header menu switches light, dark and system with Turkish labels; checkboxes are 18 px with spaced labels; the Dynamic Forms field dialog inputs and the type list are both 31 px; the color editor shows the picker, the hex box and the palette in one row; the chat sample lists `ChatHub.cs`, `OnlineChatServiceCollectionExtensions.cs` and `ChatConnection.ts` first; the phone filter button joins the toolbar and the pager stays inside every sample card. Not run: provider matrix (no data-access change).

## Local evidence: theme first paint (2026-10-31, `1016cf1`)

Branch `fix/theme-first-paint` on `main` `f02a161`, fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI. Every step of `ci.yml` passed: strict guards, frozen install, Release build, `dotnet test`, text templates and server types `-Check`, Extensions Vitest 47, DynamicForms Vitest 1, Theme strict suite (including the new first paint check), `Test-Packages.ps1` (now requiring the init script in the archive), both consumer checks, clean working tree.

Checked in a scratch Serene 10.5.2 host with the operating system set to light and dark saved. With the script removed from the served page, the page body starts in `system` mode on the light background `rgb(246, 247, 251)` and changes to dark when `ScriptInit` runs. With the script, the body starts in `dark` on `rgb(21, 25, 39)` and stays there. The header menu changes the mode once per click, without an intermediate value. Not run: provider matrix (no data-access change).

## Local evidence: remaining demo review items (2026-10-31, `5632530`)

Branch `feat/demo-ux-review` on `main` `bc6e8d7`, fresh clone at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.19. Local evidence, not CI. Every step of `ci.yml` passed: strict guards, frozen install, Release build, `dotnet test` 28 passed (Todo 5, Extensions 1, DynamicForms 1, OnlineChat 10, Integration 11), text templates and server types `-Check`, Extensions Vitest 53, DynamicForms Vitest 1, Theme strict suite, package and both consumer checks, clean working tree.

Checked in a scratch Serene 10.5.2 host: all 15 samples and the module pages crawled in Turkish and in English for text of the other language, which found only seeded rows; after the texts moved to resources, the 15 samples crawled again in both languages for introductions and untranslated `Site.Demo` keys, with none found. By eye: Grid Formatters in light and dark at 1280x800 and in dark at 375x812; Design Tokens in dark at both sizes; Mode and Accent and the empty task list in dark at 1280x800; the chat list and conversation in dark at 375x812. Not run: provider matrix (no data-access change).

## Local evidence: phone grid scroll and presence names (2026-10-31, `9690423`)

Same branch and environment as the section above. Local evidence, not CI. Every step of `ci.yml` passed: strict guards, frozen install, Release build, `dotnet test` 29 passed (Todo 5, Extensions 1, DynamicForms 1, OnlineChat 11, Integration 11), text templates and server types `-Check`, Extensions Vitest 53, DynamicForms Vitest 1, Theme strict suite, package and both consumer checks, clean working tree.

Checked in the scratch host at 440x956: Customers, Orders and Products scroll to their last row inside the grid; the toolbar, the sticky header and the pager stay in view, and the page itself does not scroll. Users, Roles, Tasks, Statuses and Form Definitions have too few rows to scroll and keep the pager on screen. Presence with a second user over WebSockets: the first browser shows the display name when that user connects and leaves, and a name containing HTML is shown as text. Not run: provider matrix (no data-access change). Open: a non-admin long-polling connection was refused by the hub's permission check in this host; cause not investigated.

## Local evidence: phone chat panel and form design list (2026-10-31, `d896c02`)

Same branch and environment as the section above. Local evidence, not CI. Every step of `ci.yml` passed, with the same test counts as above: `dotnet test` 29, Extensions Vitest 53, DynamicForms Vitest 1, Theme strict suite, package and both consumer checks, clean working tree.

Checked in the scratch host at 440x956: a selected room fills the screen below the header, the back button returns to the list and the message box is one field; the Dynamic Forms field list starts in line with the inputs, stays inside the form and its table scrolls sideways; the left edge of the quick search and filter inputs is whole. At 1280x800 the field list keeps its layout. The owner saw a room click do nothing on a first load. That was not reproduced: five fresh page loads with an immediate click on the room each opened the conversation.

## Serenity team preview shared (2026-11-07)

Source commit `b947c15` (`main`), snapshot `Bizeka/bizeka-platform-preview` commit `a8c137c`, 469 files, one commit, built with the repository snapshot tool after PR 49 (reviewer guide refresh, `dependabot.yml` excluded). Strict guards passed on the snapshot; gitleaks 8.24.3 found no leaks in the preview history and the dry-run snapshot of the same content. Invited on 2026-11-07 with the Read role: the Serenity maintainers `volkanceylan` and `VictorTomaili`. Access is for review only; no license is granted (ADR 0001). Feedback is implemented here and published as a new snapshot; the preview repository is never edited directly.

## Local evidence: Serenity 10.6.3 upgrade (2026-11-16)

Branch `chore/serenity-10.6.3` on top of `feat/demo-ux-polish` (`2ac8f00`), fresh worktree at a short path, Windows 11, PowerShell 7, .NET SDK 10.0.401, Node 24.22. Local evidence, not CI. Baseline is the 2026-10-24 runs above on 10.5.2, plus the theme strict suite on `2ac8f00`, which failed before this change (the component contract test still looked for the old system dark-mode selector).

| Step | Result |
| --- | --- |
| Guards (strict) | Passed |
| `Initialize-Dependencies.ps1` (frozen install), Release build | Passed (0 warnings, 0 errors) |
| `dotnet test` | 25 passed: Todo 5, Extensions 1, DynamicForms 1, OnlineChat 9, Integration 9 (SQLite) |
| Sergen and text templates, run twice | Second run produced no diff |
| Text templates, server types (`-Check`) | Passed |
| Extensions Vitest, DynamicForms Vitest | 45 passed, 1 passed |
| Theme strict suite | Passed after the test selector fix |
| `Test-Packages.ps1`, `Test-NpmConsumer.ps1`, `Test-PackageConsumer.ps1` | Passed |
| `Test-Dependencies.ps1` (strict) | Passed: NuGet and npm audits clean, no suppressions |
| `Test-Provider.ps1` SQL Server, PostgreSQL, MySQL | Passed: integration suite, 9 tests per provider (SQL Server 2022, PostgreSQL 17, MySQL 8.4 in Docker) |

Not run: image upload, resize and hostile-input checks in a real host with the SkiaSharp native runtime (no Platform module processes images; the host supplies SkiaSharp); the Commercial repository upgrade; GitHub Actions (jobs do not start on this account).
