---
status: accepted
scope: repository
version: 3
date: 2026-10-01
last_reviewed: 2026-11-16
---

# ADR 0001 - Private until production-ready, then MIT under Bizeka

## Decision
The repository stays private in the `Bizeka` organization. It is made public (MIT) only when every criterion below is met and recorded in `docs/release/public-gate.md`.

## Exit criteria (all measurable in CI)
1. Clean clone builds on Windows and Linux with TypeScript included and no suppressed failures.
2. Provider matrix green: SQL Server, PostgreSQL, MySQL (install from empty database, second run no-op, basic CRUD). Oracle is deferred until a suitable test environment exists; it is not a public-release prerequisite or a certified provider.
3. Sergen twice with zero diff on the second run.
4. Repository guards, security header scan and dependency vulnerability scan clean.
5. `README`, `CONTRIBUTING`, `SECURITY`, `LICENSE` (MIT), `THIRD-PARTY-NOTICES`, versioning policy present.
6. Used in at least one real (private) customer solution as versioned packages.
7. History scanned for secrets, customer names, absolute paths and licensed upstream content.
8. Version `1.0.0-rc` reached; before that all versions are `0.x`.

## Sharing before the gate

Read-only collaborator invitation to the Serenity maintainer is allowed once the owner decides; no other sharing.

## Owner clarification (2026-10-22)

Oracle support was deferred for both Platform and the separate product repositories because no suitable test environment is available. For this repository, the release matrix is PostgreSQL, SQL Server and MySQL. Do not claim Oracle compatibility or certification without a future implementation, test environment and recorded verification. The customer-package usage requirement remains unmet; host templates in an inaccessible repository are not evidence of customer use.

## Owner decision: public alpha (2026-11-16)

The owner decided to release the repository publicly under the MIT license as an **alpha**, first release `0.1.3-alpha`, before every exit criterion above is met. This supersedes the "all criteria first" rule for alpha (`0.x`) releases only. The public repository starts from a clean, history-free snapshot authored as `Bizeka <platform@bizeka.com>`. The criteria stay the bar for production certification and `1.0.0-rc`; their honest status is recorded in [public-gate.md](../release/public-gate.md), and the README states that the release is alpha and not production-certified.

## Consequences
`LICENSE` is the full MIT text and packages declare `MIT`. Until the criteria are met, no release may be described as production-ready or certified.
