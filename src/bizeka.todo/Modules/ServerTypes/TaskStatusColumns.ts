import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { TaskStatusRow } from "./TaskStatusRow";

export interface TaskStatusColumns {
    Id: Column<TaskStatusRow>;
    Name: Column<TaskStatusRow>;
    SortOrder: Column<TaskStatusRow>;
    Color: Column<TaskStatusRow>;
    IsCompleted: Column<TaskStatusRow>;
    IsActive: Column<TaskStatusRow>;
}

export class TaskStatusColumns extends ColumnsBase<TaskStatusRow> {
    static readonly columnsKey = 'Todo.TaskStatus';
    static readonly Fields = fieldsProxy<TaskStatusColumns>();
}