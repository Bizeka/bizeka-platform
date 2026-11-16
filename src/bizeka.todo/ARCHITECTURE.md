# Bizeka.Todo Architecture

## Boundary

`Bizeka.Todo` stays reusable by keeping task persistence and core behavior inside the module boundary.

The open-source package owns:

- persistence model
- CRUD endpoints
- standard Serenity pages
- basic validations
- authenticated assignment semantics and the task-assignee relation

Extensions build on this model without redefining it.

## Assignment Strategy

The task model separates the user who assigns a task from the users who receive it.

- `AssignedByUserId` is resolved from the authenticated user on create and is read-only on update.
- `TaskAssignees` is the canonical many-to-many relation for assigned users.
- `AssigneeText` and `AssignedUserId` remain read-only legacy fields for database compatibility only.
- Display names are resolved through the host user lookup; task records do not store user names.

## Ordering Strategy

`SortOrder` exists in the base package so every UI built on the module shares the same ordering model.

A richer UI can add drag-drop reordering without changing the core schema.
