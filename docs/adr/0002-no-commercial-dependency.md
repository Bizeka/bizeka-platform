---
status: accepted
scope: repository
version: 1
date: 2026-10-01
---

# ADR 0002 - Platform never depends on commercial or licensed upstream code

## Decision
No project, package, import, namespace or document in this repository refers to commercial packages, SSU or StartSharp. Enforced by `tools/Test-RepoGuards.ps1` (rule `platform-boundary`) in CI.

## Rationale
Keeps the MIT release legally clean and the dependency direction physical rather than conventional.