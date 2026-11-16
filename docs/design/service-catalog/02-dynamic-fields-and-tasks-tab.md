# 02 - Dynamic fields per kind and the Tasks tab

These are the only two custom UI pieces in the module. Everything else is Sergen output.

## A. Kind-driven dynamic fields (`Services.DynamicDataJson`)

Server: `ServiceRow : DynamicDataRow<ServiceRow.RowFields>` from `Bizeka.DynamicForms`. The base class already declares the `DynamicDataJson` column, so the row only adds its own fields.

Client: `ServiceDialog extends DynamicBaseDialog<ServiceRow>`, the same base the demo page `NorthwindCustomerFields` uses. The one difference from that sample is that the form key is not constant; it comes from the selected kind:

```ts
protected override getDynamicSchemaFormKey() {
    const kindId = this.form.ServiceKindId.value;
    return ServiceKindRow.getLookup().itemById[kindId]?.DynamicFormKey ?? null;
}
```

When the kind editor changes, the dialog re-reads the definition and rebuilds the dynamic tab. Open question for implementation: whether `DynamicBaseDialog` already supports re-running schema resolution after load; if not, add a protected `reloadDynamicSchema()` to DynamicForms rather than working around it in ServiceCatalog.

Seeded definitions (all fields on tab `Details`):

| Kind | Fields |
| --- | --- |
| Web API | BaseUrl (string), OpenApiUrl (string), AuthScheme (string), HealthCheckPath (string) |
| Web App | PublicUrl (string), Framework (string), SupportsDarkMode (bool) |
| Database | Engine (string), Version (string), Host (string), BackupWindow (string), SizeGb (decimal) |
| Scheduled Job | CronExpression (string), Runtime (string), LastRunAt (datetime), AlertEmail (string) |
| Message Queue | Broker (string), TopicPrefix (string), RetentionHours (int) |
| Library | PackageId (string), Registry (string), CurrentVersion (string) |

A kind with no `DynamicFormKey` shows no dynamic tab. Adding a kind is a data change only: one `ServiceKinds` row and one `DynamicFormDefinitions` row.

## B. Tasks tab (Todo embedded in the service dialog)

Pattern: Northwind `CustomerForm` places `NotesEditor` on its own tab with `[Tab("Notes")]`. ServiceCatalog does the same with a `ServiceTasksEditor`.

Server side, `ServiceForm`:

```csharp
[Tab("Tasks"), ServiceTasksEditor, IgnoreName]
public List<int>? TaskItemIds { get; set; }
```

The editor's value is the list of linked `TaskItemId`s. `ServiceRow` exposes it as a `ListField<int>` populated by a `LinkingSetRelation` on `ServiceTasks`, so Serenity's save handler writes the link rows and nothing custom runs on the server for the link itself.

Client side, `ServiceTasksEditor` (`EditorWidget`, `IGetEditValue`/`ISetEditValue`) renders:

- a toolbar with **New task** and **Link existing**;
- a `TaskItemGrid` from `@bizeka/todo`, filtered by `Id in (linked ids)` through `TaskItemService.List` (so Todo's visibility rule applies: the viewer sees only linked tasks they created, assigned or are assigned to);
- a status-coloured badge per row reusing `TaskStatusColor`.

**New task** opens Todo's own `TaskItemDialog`, pre-filled with `ReferenceNo = service slug` and `TagsText` containing the kind name. On save success the new id is appended to the editor value; the link is written when the service is saved. **Link existing** opens a `TaskItemGrid` in a lookup dialog and appends the selected id.

New-record behaviour matches Northwind: the tab is disabled until the service has an id, because the link needs `ServiceId`.

### Tasks carrying extra fields (`TaskItems.DynamicDataJson`)

`TaskItemDialog` is a plain `EntityDialog` today, so the module provides `ServiceTaskDialog extends TaskItemDialog` that mixes in the dynamic-schema behaviour with form key `ServiceCatalog.Task`. The seeded definition adds, on a tab named `Service`:

| Field | Type |
| --- | --- |
| Environment | string (dev / staging / production, suggestions editor from Extensions) |
| RunbookUrl | string |
| ChangeTicket | string |

That is the first consumer of `TaskItems.DynamicDataJson` in the Platform. If turning `TaskItemDialog` into a `DynamicBaseDialog` proves simpler than a subclass, do that in Todo under a separate commit, with the form key left null by default so existing hosts see no change.

## C. What stays generic

Both pieces are written so another module can copy them: the editor takes the Todo grid and the link field name as options, and the kind-to-form-key lookup is a one-line override. Documenting that in the module README is part of the definition of done.
