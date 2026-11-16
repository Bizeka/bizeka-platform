import { TaskItemRow } from "../ServerTypes/TaskItemRow";
import { addGridEmptyState } from "@bizeka/extensions";
import { Attributes, EntityGrid, type WidgetProps } from "@serenity-is/corelib";
import { TaskItemDialog } from "./TaskItemDialog";

void Attributes;

export class TaskItemGrid<P = {}> extends EntityGrid<TaskItemRow, P> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskItemGrid");

    protected override getColumnsKey() { return "Todo.TaskItem"; }
    protected override getDialogType() { return TaskItemDialog; }
    protected override getRowDefinition() { return TaskItemRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskItem"; }
    protected override getService() { return "Todo/TaskItem"; }

    constructor(props: WidgetProps<P>) {
        super(props);
        addGridEmptyState(this);
    }
}
