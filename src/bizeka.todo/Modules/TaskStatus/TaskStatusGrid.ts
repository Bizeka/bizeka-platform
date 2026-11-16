import { TaskStatusRow } from "../ServerTypes/TaskStatusRow";
import { EntityGrid } from "@serenity-is/corelib";
import { TaskStatusDialog } from "./TaskStatusDialog";

export class TaskStatusGrid<P = {}> extends EntityGrid<TaskStatusRow, P> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskStatusGrid");

    protected override getColumnsKey() { return "Todo.TaskStatus"; }
    protected override getDialogType() { return TaskStatusDialog; }
    protected override getRowDefinition() { return TaskStatusRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskStatus"; }
    protected override getService() { return "Todo/TaskStatus"; }
}
