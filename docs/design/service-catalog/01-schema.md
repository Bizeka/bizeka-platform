# 01 - Schema

Module name `ServiceCatalog`, connection key `Default`, namespace `Bizeka.ServiceCatalog`, npm package `@bizeka/servicecatalog`. Every row follows the reviewer-guide conventions: form keys `ServiceCatalog.<Entity>`, permissions `ServiceCatalog:<Entities>:View|Modify`, lookups `ServiceCatalog.<Entity>`.

## Tables

### Teams
| Column | Type | Notes |
| --- | --- | --- |
| Id | int identity PK | |
| Name | nvarchar(100) not null | unique |
| Slug | nvarchar(60) not null | unique, lowercase kebab; validated server side |
| Color | nvarchar(9) null | `ColorHexEditor` from Extensions |
| ContactEmail | nvarchar(200) null | |
| IsActive | bit not null default 1 | |

### ServiceKinds
| Column | Type | Notes |
| --- | --- | --- |
| Id | int identity PK | |
| Name | nvarchar(100) not null | unique |
| Icon | nvarchar(60) null | Font Awesome class, same convention as Todo status icons |
| Color | nvarchar(9) null | badge colour |
| DynamicFormKey | nvarchar(100) null | `DynamicFormDefinitions.FormKey` of the field set shown for this kind |
| SortOrder | int not null default 0 | |
| IsActive | bit not null default 1 | |

### Services
| Column | Type | Notes |
| --- | --- | --- |
| Id | int identity PK | |
| Name | nvarchar(200) not null | |
| Slug | nvarchar(80) not null | unique |
| ServiceKindId | int not null FK ServiceKinds | `LookupEditor`; drives dynamic fields |
| TeamId | int null FK Teams | lookup editor |
| Lifecycle | int not null default 0 | enum `ServiceLifecycles` in `Modules/Enums/` (`EnumKey("ServiceCatalog.ServiceLifecycles")`): Experimental, Production, Deprecated, Retired; `EnumEditor` |
| RepoUrl | nvarchar(500) null | |
| DocsUrl | nvarchar(500) null | |
| Description | nvarchar(max) null | |
| TagsText | nvarchar(500) null | `TagsEditor` from Extensions, same as `TaskItems.TagsText` |
| DynamicDataJson | nvarchar(max) null | row inherits `JsonDataRow` (via `DynamicDataRow`) |
| InsertUserId / InsertDate / UpdateUserId / UpdateDate | audit | `IInsertLogRow`, `IUpdateLogRow` |

### ServiceDependencies
| Column | Type | Notes |
| --- | --- | --- |
| Id | int identity PK | |
| ServiceId | int not null FK Services | cascade delete |
| DependsOnServiceId | int not null FK Services | no cascade; self-dependency rejected |
| Note | nvarchar(300) null | |

Unique index on (ServiceId, DependsOnServiceId). Shown as a plain detail grid on a **Dependencies** tab; no graph.

### ServiceTasks (link table)
| Column | Type | Notes |
| --- | --- | --- |
| ServiceId | int not null FK Services | cascade delete |
| TaskItemId | int not null FK TaskItems | cascade delete |

Composite PK (ServiceId, TaskItemId). Owned by ServiceCatalog, so Todo's schema and migrations stay untouched. A task may be linked to more than one service.

## Migrations (`Migrations/DefaultDB`, tag `DefaultDB`)

1. `DefaultDB_20261110_1000_Initial` - the five tables, FKs, unique indexes.
2. `DefaultDB_20261110_1010_SeedKinds` - six kinds: Web API, Web App, Database, Scheduled Job, Message Queue, Library. Each with icon and colour.
3. `DefaultDB_20261110_1020_SeedKindDefinitions` - one `DynamicFormDefinitions` row per kind (see 02). Keys `ServiceCatalog.Kind.<Slug>`.
4. `DefaultDB_20261110_1030_SeedTaskDefinition` - `ServiceCatalog.Task` definition for the Tasks tab.

Demo-only seed (in `Bizeka.Demo`, not the module): three teams and ten example services with dependencies, so the demo page is not empty.

Run the provider tests for all three dialects before merging; the composite PK and the self-referencing FK are the parts most likely to differ.

## Permissions
- `ServiceCatalog:Services:View` - list, retrieve.
- `ServiceCatalog:Services:Modify` - insert, update, delete for Services and Dependencies.
- `ServiceCatalog:Admin` - Teams and ServiceKinds.
- The Tasks tab reuses Todo's own permission keys; ServiceCatalog adds nothing there.

## Navigation
`Service Catalog` section with Services, Teams, Kinds. Registered through `services.AddBizekaServiceCatalog()` plus Serenity type discovery, mirroring `AddBizekaTodo()`.
