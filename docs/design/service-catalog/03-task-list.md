# 03 - Implementation task list

Order matters: each step leaves the build green and the guards passing. Branch `feat/service-catalog`, one PR per numbered group.

## 1. Skeleton (half a day)
- [ ] Create `src/bizeka.servicecatalog` as a Razor class library copied from the Todo project layout (csproj, `sergen.json`, `tsconfig`, `package.json`, `texts`, `GlobalUsings`).
- [ ] Add to `Bizeka.Platform.slnx`, `tools/Initialize-Dependencies.ps1`, package and consumer scripts (`Test-Packages`, `Test-PackageConsumer`, `Test-NpmConsumer`), and the README module table.
- [ ] `ServiceCatalogPermissionKeys`, `ServiceCatalogNavigation`, `ServiceCatalogTexts`, `AddBizekaServiceCatalog()`.
- [ ] `ArchitectureTests` entry so the platform-boundary guard covers the new project.

## 2. Data (one day)
- [ ] Migrations 1000 and 1010 (tables, kinds).
- [ ] Rows: `TeamRow`, `ServiceKindRow` (with `LookupScript`), `ServiceRow : DynamicDataRow`, `ServiceDependencyRow`, `ServiceTasks` via `LinkingSetRelation` on `ServiceRow.TaskItemIds`.
- [ ] Slug validation in `AppServices/Service/ServiceBllService` (behind `IServiceBllService`), self-dependency rejection in `ServiceDependencyBllService`; handlers stay thin.
- [ ] Run `./tools/Test-Provider.ps1` for Postgres, SqlServer, MySql.

## 3. Generated UI (half a day)
- [ ] Sergen: Teams, ServiceKinds, Services, ServiceDependencies (grid + dialog + form + columns + endpoint).
- [ ] `./tools/Update-ServerTypes.ps1` and `./tools/Update-TextTemplates.ps1`; Turkish texts.
- [ ] Lifecycle formatter using Theme semantic tokens; `TagsEditor` and `ColorHexEditor` from Extensions on the forms.

## 4. Dynamic fields (one day)
- [ ] Migration 1020 with the six kind definitions.
- [ ] `ServiceDialog extends DynamicBaseDialog`, kind-driven `getDynamicSchemaFormKey()`.
- [ ] Verify or add schema reload on kind change in DynamicForms (separate commit if DynamicForms changes).
- [ ] npm test for the dialog: changing kind swaps the dynamic tab, saving round-trips `DynamicDataJson`.

## 5. Tasks tab (one to two days)
- [ ] `ServiceTasksEditor` with `TaskItemGrid`, **New task**, **Link existing**; disabled on new records.
- [ ] Migration 1030 (`ServiceCatalog.Task` definition) and `ServiceTaskDialog` with the `Service` tab.
- [ ] Test: linked ids survive save; a task linked to two services shows under both; a viewer without Todo visibility sees an empty tab, not an error.

## 6. Demo and docs (half a day)
- [ ] Demo seed migration (teams, ten services, dependencies) and a `ServiceCatalog/ServiceOverview` sample page with `SampleInfo`.
- [ ] Module `README.md`, `ARCHITECTURE.md`, `FEATURE_MATRIX.md` in the Todo style; animated GIF of kind switch and Tasks tab.
- [ ] `docs/reviewer-guide.md`: add the module to the table and a paragraph under "See it running".
- [ ] `docs/release/public-gate.md`: note the seventh package in the consumer check.

## Definition of done
- `dotnet build` and `dotnet test` green; `Test-RepoGuards -Strict`, text and server-type checks clean.
- Provider tests pass on all three dialects.
- Consumer check restores seven packages and resolves `AddBizekaServiceCatalog()`.
- The demo page works in a Serene 10.6.3 host with only the Platform packages installed.

## Good first issues (to open on the public repo at release)
1. Add a `ServiceKind` for "Static Site" with its definition (data only).
2. Add a `ServiceKind` for "Mobile App" with store URLs (data only).
3. Service list: filter by lifecycle quick-filter.
4. Export the catalog as CSV (uses Serenity's report helpers).
5. Dependency grid: show the dependency's lifecycle badge.
6. Dark-mode check of the lifecycle badges against Theme tokens.

Larger follow-ups that belong in extension packages, not the module: health-check pinger, GitHub repository metadata sync, dependency graph view, incident log.
