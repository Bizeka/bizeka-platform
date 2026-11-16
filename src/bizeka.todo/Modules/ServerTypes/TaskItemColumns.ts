import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { TaskItemRow } from "./TaskItemRow";

export interface TaskItemColumns {
    Id: Column<TaskItemRow>;
    Summary: Column<TaskItemRow>;
    ReferenceNo: Column<TaskItemRow>;
    TaskPriorityName: Column<TaskItemRow>;
    TaskStatusName: Column<TaskItemRow>;
    SortOrder: Column<TaskItemRow>;
    StartDate: Column<TaskItemRow>;
    DueDate: Column<TaskItemRow>;
    CompletedOn: Column<TaskItemRow>;
}

export class TaskItemColumns extends ColumnsBase<TaskItemRow> {
    static readonly columnsKey = 'Todo.TaskItem';
    static readonly Fields = fieldsProxy<TaskItemColumns>();
}