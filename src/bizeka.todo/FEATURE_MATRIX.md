# Bizeka.Todo Feature Matrix

## Open Source

- `TaskItem`, `TaskPriority`, `TaskStatus` core entities
- Shared `Default` connection
- Standard Serenity CRUD pages
- Database-backed status and priority definitions
- `AssignedByUserId` for the server-owned assigning user
- `TaskAssignees` relation for multiple assigned users
- `ReferenceNo`, `TagsText`
- `SortOrder`
- `StartDate`, `DueDate`, `CompletedOn`
- `EstimatedMinutes`, `ActualMinutes`
- Basic save validations
- User lookup and multiple-assignee editing
- New tasks default the start date to now; All Day switches both schedule editors to date-only

TR: Yeni görevde başlangıç tarihi şimdiyle doldurulur. Tüm Gün seçimi iki tarih alanını da yalnız tarih gösterecek şekilde değiştirir; mevcut kayıt tarihleri korunur.

## Outside this module

Not provided here; a host or an extension can add them on top of the model above.

- Dashboard widget / view component
- Drag-drop reorder in widget
- Widget filter settings
- Attachments
- Speech-to-text
- Checklist / comments / reminders
- Audit trail
