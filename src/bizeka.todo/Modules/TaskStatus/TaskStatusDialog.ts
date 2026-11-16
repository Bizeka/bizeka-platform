import { TaskStatusRow } from "../ServerTypes/TaskStatusRow";
import { EntityDialog } from "@serenity-is/corelib";
import { ColorHexEditor } from "@bizeka/extensions";

void ColorHexEditor;

export class TaskStatusDialog extends EntityDialog<TaskStatusRow> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskStatusDialog");

    protected override getFormKey() { return "Todo.TaskStatus"; }
    protected override getRowDefinition() { return TaskStatusRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskStatus"; }
    protected override getNameProperty() { return "Name"; }
    protected override getService() { return "Todo/TaskStatus"; }
}
