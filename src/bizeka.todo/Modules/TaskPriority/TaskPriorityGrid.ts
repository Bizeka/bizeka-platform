import { TaskPriorityRow } from "../ServerTypes/TaskPriorityRow";
import { EntityGrid } from "@serenity-is/corelib";
import { TaskPriorityDialog } from "./TaskPriorityDialog";

export class TaskPriorityGrid<P = {}> extends EntityGrid<TaskPriorityRow, P> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskPriorityGrid");

    protected override getColumnsKey() { return "Todo.TaskPriority"; }
    protected override getDialogType() { return TaskPriorityDialog; }
    protected override getRowDefinition() { return TaskPriorityRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskPriority"; }
    protected override getService() { return "Todo/TaskPriority"; }
}
