# Bizeka.ServiceCatalog - design packet

Decision: [ADR 0004](../../adr/0004-service-catalog-community-module.md). Turkish owner summary: [OZET-TR.md](OZET-TR.md).

| Document | Content |
| --- | --- |
| [01-schema.md](01-schema.md) | Tables, columns, migrations, seed data, keys and permissions |
| [02-dynamic-fields-and-tasks-tab.md](02-dynamic-fields-and-tasks-tab.md) | The two custom UI pieces: kind-driven `DynamicDataJson` and the Todo tab |
| [03-task-list.md](03-task-list.md) | Implementation steps in order, definition of done, good first issues |

## Elevator pitch (for the README of the module)

> A service catalog your team will actually keep up to date. Register every API, database, job and site you run, say who owns it and where it lives in its lifecycle. Each kind of service gets its own fields without writing code, and every service carries its own task list. Built only on Serenity and the open-source Bizeka Platform modules.

## Scope guard

In: Team, ServiceKind, Service, ServiceDependency, ServiceTasks; Sergen CRUD; kind-driven dynamic fields; Tasks tab; seed data; one demo page.

Out (community or host): health checks and pings, GitHub/GitLab/CI integration, dependency graph drawing, notifications, SLA/incident tracking, multi-tenant boundaries.
