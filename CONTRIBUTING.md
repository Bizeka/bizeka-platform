# bizeka-platform engineering rules

Canonical engineering rules for this repository. They are enforced by repository guards and CI.

## Scope
Open-source platform modules only, released under the MIT license (public alpha decided 2026-11-16, ADR 0001); write every file as public.

## Hard boundaries
- No reference to commercial code or packages (`*.Pro` packages, SSU, StartSharp, Serenity Pro). Enforced by `tools/Test-RepoGuards.ps1`.
- No customer names, internal hostnames, absolute local paths or secrets in any file or history.
- Technical docs, code, commit messages and ADRs in English. User-facing feature docs bilingual (TR/EN).
- Every third-party dependency needs a license check and an entry in `THIRD-PARTY-NOTICES.md` (create with the first dependency).

## Versions
.NET 10, Serenity packages and Sergen `10.6.3` (pinned in `.config/dotnet-tools.json`). Frontend `@serenity-is/corelib|domwise|sleekgrid|extensions` and `@serenity-is/tsbuild` 10.6.3; TypeScript 7.0.2 (Serenity 10.6.3 builds with TypeScript 7; 7.0.1 is not published on npm).

## Data and provider commitment
SQL Server 2012+, PostgreSQL and MySQL are supported. A module is labeled "certified" per provider only when the CI provider matrix is green. Use Serenity `SqlQuery`/dialect; Dapper only behind the approved dialect helper. No provider-specific SQL, no `SELECT *`.
- Identifiers in an `Expression` attribute and in any SQL text are quoted with brackets (`jParty.[LegalName]`, `FROM [Enrollments] e WHERE e.[TrainingGroupId] = T0.[Id]`): PostgreSQL folds an unquoted name to lower case and the query fails; Serenity turns the brackets into the quotes of the provider. An expression names real columns of the joined table only. Guard rule `sql`.
- A date-only value is stored in an `AsDateTime()` column with the time part 00:00; `AsDate()` is not used, because Npgsql returns a `date` column as `DateOnly` and a Serenity `DateTimeField` cannot read it. Guard rule `migration`.
- PostgreSQL sessions use UTC. Code stores UTC timestamps, and screens convert them to the user's time zone.
- Until the first customer database exists, a migration of this pre-production period may be corrected in place (no installation has data to migrate); after that, migrations are append only.

## Schema and tenancy
- Plural tables/enums, `Id` PK, `<Entity>Id` FK, `[Tags("<Db>DB"), Migration(YYYYMMDD_HHMM)]`; discuss schema with the owner first.
- Tenant/company isolation is enforced by a scope behavior on scoped rows (default deny). Never decide privilege from role names or URL paths.
- Secret-bearing fields: `[MinSelectLevel(SelectLevel.Never)]`.

## Engineering rules
Async handler bases only; `CancellationToken` end to end; no sync-over-async; thin host/endpoints/handlers with business rules in application services; localized text only; UTF-8; never edit generated code (Sergen twice, second run zero diff); shared Bootstrap 5 and theme tokens (`--bzk-*` -> `--bizeka-*` -> literal fallback).

## Build and verification gates
Run the tools with PowerShell 7 (`pwsh`). On Windows, clone to a short path (for example `C:\src\bizeka-platform`): nested esbuild binaries under `node_modules` exceed 260 characters in deep folders and the build fails with `spawn ... ENOENT` even when long paths are enabled.
No `ContinueOnError` or `TypeScriptNoEmitOnError=false`; TypeScript always built in CI; repository guards, architecture tests, unit tests and provider matrix must pass. Record baseline and post-change results in the PR; state what was not run.

## Packaging
NuGet `Bizeka.<Module>` and npm `@bizeka/<module>`; semantic versions, `0.x` until the public gate. Packages are published from CI only.

## Module structure, texts and enums (mandatory; reference project: Serenity `Demo.Northwind`)
Enforced by `tools/Test-RepoGuards.ps1` (rules `turkish-text`, `localization`, `enum`, `migration`, `sql`, `form-editor`, `display-text`, `row-caption`, `namespace`, `method-name`) in CI.

**Folders.** One module project per product: `src/bizeka.<name>/`.
```text
Modules/<Area>/<Entity>/   Row, Columns, Form, Grid(.ts), Dialog(.ts), Endpoint, Page(.cs/.ts), RequestHandlers/
Modules/Enums/             all enums of the module (plural type names)
AppServices/<Topic>/       application services (business rules); handlers stay thin
Migrations/<Db>DB/         [Tags("<Db>DB"), Migration(YYYYMMDD_HHMM)] files
texts/                     <Module>DbTexts.cs, <Module>ValidationTexts.cs (+ other *Texts.cs)
texts/resources/           <module>.texts.__.json, <module>.texts.en.json, <module>.texts.tr.json
```

**One type per file.** Each row, columns class, form, endpoint, page controller, request handler, lookup, enum, service and interface has its own `.cs` or `.ts` file. In an entity `RequestHandlers/` folder only, one handler file may contain the exact pair `I<Entity><Operation>Handler` and `<Entity><Operation>Handler`; no other multi-type handler file is allowed. Do not group endpoints, pages or enums. Put request handlers in the entity's `RequestHandlers/` folder and name each file `<Entity>(Delete|List|Retrieve|Save)Handler.cs`. Keep one `<Entity>Endpoint.cs` per entity.

**SOLID and business rule services.** Give each class one responsibility and depend on small interfaces. Avoid static state. Keep the host, endpoints and handlers thin; handlers delegate business rules to application services. Put entity rules in `AppServices/<Topic>/<Entity>BllService.cs` behind `I<Entity>BllService.cs`; use a separate service for each entity or small workflow. Pass the caller's unit of work or connection and `CancellationToken` into async service methods. Services do not open their own connection, call request handlers, or hold more than four dependencies or four public methods. Handler overrides such as `ValidateRequestAsync`, `BeforeSave` and `AfterSave` delegate to the service. Entities without custom rules use Serenity's base handlers and need no service.

**File and method size.** Keep hand-written C# files at or below 200 lines where practical. Files over 200 lines are reviewed for single responsibility; files over 300 lines fail the strict repository guard. Methods over 40 lines are reviewed for smaller responsibilities. Generated `ServerTypes`, migrations and tests are excluded from these limits.

**Method names.** A method name we declare has at most 30 characters, test methods included; the `Async` suffix counts. Say what the method does in a few words (`PaymentUpdatesPartyBalance`, `LastSeatIsRefused`); the scenario details of a test belong in a comment or in the assertion message, not in the name. Overrides and implementations of framework or library members are exempt.

**Form fields (screen quality).** A field is never a bare input that shows a number. In a form class (`[FormScript]`): a key (`...Id`) is a `LookupEditor` showing the name of the record (cascading where it depends on another field), an enumerated code (`...Type`, `...Kind`, `...Status`, `...Mode`, `...Level`, `...Role`, `...Gender`, `...Cycle`) is an enum-typed property with `EnumEditor` and localized texts, a flag (`Is...`, `Has...`) is a switch or checkbox, a colour is a colour editor, a date is a date editor. Non-obvious fields carry a placeholder and a hint that says what the field is and gives an example.

**Form and Columns declarations (Northwind standard).** Every Form carries `[FormScript("<Module>.<Entity>")]` and `[BasedOnRow(typeof(<Entity>Row), CheckNames = true)]`; every Columns class carries `[ColumnsScript("<Module>.<Entity>")]` and the same `BasedOnRow`. `<Entity>` is the Row class name without `Row`; the key of the Form and the Columns of one entity is identical; the class is named `<Entity>Form` and `<Entity>Columns`.
`CheckNames = true` is never removed or set to false to make a build pass. A name mismatch is fixed by correcting the property name in the Form or Columns class (it must equal a Row property).

**Namespaces (Serenity convention; reference: `Demo.Northwind` and the Serene template).** The folder `Modules` and the entity folder never appear in a namespace.
- `Modules/<Area>/<Entity>/`: rows, request handlers, pages, lookups and other server types use `<RootNamespace>.<Area>`; columns classes use `<RootNamespace>.<Area>.Columns`, forms `<RootNamespace>.<Area>.Forms`, endpoints `<RootNamespace>.<Area>.Endpoints`.
- `Modules/Enums/`: `<RootNamespace>` (or `<RootNamespace>.<Area>` when the enum belongs to one area).
- `AppServices/<Topic>/`: `<RootNamespace>.AppServices`. `texts/`: `<RootNamespace>.Texts`. `Migrations/<Db>DB/`: `<RootNamespace>.Migrations`.

**Language rules.**
- Code, identifiers, comments, commit messages, technical docs: English. Turkish exists only in `*.tr.json`. No Turkish text anywhere in code (also not in comments).
- No hardcoded user-visible text: table captions, form and column titles, notifications, validation and exception messages shown to users all come from `LocalText` entries or Serenity framework messages. Row/Form/Columns attributes carry the **English source text** (Northwind convention); translations live in the json files.
- Texts classes: `[NestedLocalTexts(Prefix = "Db.<Module>.")]` in `<Module>DbTexts.cs` (one per module, not one per table) and `[NestedLocalTexts(Prefix = "Validation.")]` in `<Module>ValidationTexts.cs` with `public static readonly LocalText` fields.
- Json files: `*.texts.__.json` is generated from the compiled assembly by `tools/Update-TextTemplates.ps1` (never hand-edit); `en` and `tr` must contain **every** key of `__` with non-empty values. Other languages are optional.

### Display texts of rows, forms and columns
- Row property titles use readable English words in title case: split each property-name capital boundary (`WorkArea` to `Work Area`, `ProductURL` to `Product URL`, trailing `Id` remains `Id`). The class-level `DisplayName` and `InstanceName` of a Row follow Serenity `Demo.Northwind`: both are the plural table name from `TableName`, joined without spaces, and identical (`[TableName("ItemBarcodes")]`, `[DisplayName("ItemBarcodes"), InstanceName("ItemBarcodes")]`); the readable spaced plural lives in the `en` and `tr` json entries.
- `[BasedOnRow]` forms and columns inherit row titles and do not repeat text attributes unless an override is needed; overrides are plain English.
- Category and tab attributes use joined identifiers with no spaces or dots (for example `[Category("EmailStatus")]`). The module DbTexts class has `Categories.EmailStatus` (or `Tabs.EmailStatus`) whose English value is the split words; both `en` and `tr` json entries are required.
- Hint and placeholder attributes contain plain English sentences and have entries in both translation files. Enum member descriptions follow the enum rule below.
- Do not put dotted local-text keys such as `Db.*`, `Forms.*`, `Controls.*`, `Enums.*` or `Validation.*` into display attributes; Serenity treats them as completed keys and can show the raw key.
- Keep real Turkish characters in `tr` values.

**Enums.** Only under `Modules/Enums/`, plural type name, attributes `[ScriptInclude]` and `[EnumKey("<Module>.<PluralName>")]`, and `[Description("English text")]` on **every** member. Localized through the json files like any other text.

**Database.** Plural table names, primary key `Id`, foreign keys `<Entity>Id`; no ownership prefixes; explicit schema discussion with the owner before any new table.
