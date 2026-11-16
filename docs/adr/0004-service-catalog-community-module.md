---
status: accepted
scope: repository
version: 1
date: 2026-11-07
---

# ADR 0004 - ServiceCatalog is the community showcase module

## Decision
Add a seventh open-source module, `Bizeka.ServiceCatalog`: a small internal developer portal ("Backstage-lite on Serenity") that records a team's services, their owners and lifecycle. It depends only on Serenity packages and the existing Platform modules (`Extensions`, `DynamicForms`, `Todo`, `Theme`). Design packet: [docs/design/service-catalog](../design/service-catalog/README.md).

The module must stay small: four tables plus one link table, Sergen-generated CRUD, and exactly two pieces of custom UI:

1. kind-driven dynamic fields on the service dialog (`DynamicBaseDialog`, `DynamicDataJson`);
2. a **Tasks** tab on the service dialog that embeds `Bizeka.Todo`, following the Northwind Customer -> Notes editor-in-tab pattern.

Anything beyond that (health checks, GitHub or CI integration, dependency graphs, notifications) is out of scope for the module and is listed in its README as community work.

## Rationale
- The public release needs one module that a developer recognises as *their own* problem. Todo and DynamicForms are infrastructure; a service catalog is the thing a developer would fork on a Friday afternoon and adapt to their team.
- It exercises every Platform module in its natural role, so it doubles as the integration sample the reviewer guide currently lacks: `DynamicDataJson` per service kind (DynamicForms), per-entity tasks (Todo), tag and colour editors and formatters (Extensions), lifecycle badges from semantic tokens (Theme).
- `TaskItems.DynamicDataJson` exists but has no consumer in the Platform. Service tasks give it one without touching the Todo schema.
- The first contribution a newcomer can make is data, not code: a new `ServiceKind` seed row plus a `DynamicFormDefinition` JSON. That is the lowest entry barrier the Platform can offer.

## Consequences
- Todo's schema does not change. The link between a service and its tasks is owned by `ServiceCatalog` (`ServiceTasks` table). Todo's visibility rule still applies inside the tab: a user sees only the linked tasks they created, assigned or are assigned to.
- `Bizeka.Demo` gains one sample page and one seed migration; the consumer package check grows from six to seven modules.
- The repository guards (`platform-boundary`, text templates, server types) apply unchanged. Provider tests (PostgreSQL, SQL Server, MySQL) must pass for the new migrations before the module ships.
- Scope creep is the main risk. Pull requests that add integrations to the module itself should be redirected to a separate `Bizeka.ServiceCatalog.*` extension package or to the host.
