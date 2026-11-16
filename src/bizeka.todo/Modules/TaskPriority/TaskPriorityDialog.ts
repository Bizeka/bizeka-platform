import { TaskPriorityRow } from "../ServerTypes/TaskPriorityRow";
import { EntityDialog } from "@serenity-is/corelib";
import { ColorHexEditor } from "@bizeka/extensions";

void ColorHexEditor;

export class TaskPriorityDialog extends EntityDialog<TaskPriorityRow> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskPriorityDialog");

    protected override getFormKey() { return "Todo.TaskPriority"; }
    protected override getRowDefinition() { return TaskPriorityRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskPriority"; }
    protected override getNameProperty() { return "Name"; }
    protected override getService() { return "Todo/TaskPriority"; }
}
