import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { TaskPriorityRow } from "./TaskPriorityRow";

export interface TaskPriorityColumns {
    Id: Column<TaskPriorityRow>;
    Name: Column<TaskPriorityRow>;
    SortOrder: Column<TaskPriorityRow>;
    Color: Column<TaskPriorityRow>;
    IsActive: Column<TaskPriorityRow>;
}

export class TaskPriorityColumns extends ColumnsBase<TaskPriorityRow> {
    static readonly columnsKey = 'Todo.TaskPriority';
    static readonly Fields = fieldsProxy<TaskPriorityColumns>();
}