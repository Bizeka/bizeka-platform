import { TaskItemRow } from "../ServerTypes/TaskItemRow";
import { DateEditor, DateTimeEditor, EditorUtils, getLookupAsync, getRemoteData, serviceCall, tryGetWidget } from "@serenity-is/corelib";
import { DynamicBaseDialog } from "@bizeka/dynamicforms";
import { ColorHexEditor } from "@bizeka/extensions";

void ColorHexEditor;

export class TaskItemDialog extends DynamicBaseDialog<TaskItemRow> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Todo.TaskItemDialog");
    private scheduleEditorMode: boolean | null = null;
    private scheduleEditorSyncTimer?: number;

    protected override getFormKey() { return "Todo.TaskItem"; }
    protected override getRowDefinition() { return TaskItemRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "Todo.TaskItem"; }
    protected override getNameProperty() { return "Summary"; }
    protected override getService() { return "Todo/TaskItem"; }

    protected override afterLoadEntity() {
        super.afterLoadEntity();
        const startDate = this.byId("StartDate").tryGetWidget<DateTimeEditor>();
        if (this.isNew() && startDate && !EditorUtils.getValue(startDate))
            EditorUtils.setValue(startDate, "now");
        void this.setCurrentUserAsAssigner();
        this.syncScheduleEditors();
        this.scheduleScheduleEditorSync();
    }

    protected override updateInterface() {
        super.updateInterface();
        this.syncScheduleEditors();
        this.scheduleScheduleEditorSync();
    }

    private async setCurrentUserAsAssigner() {
        const assigner = this.byId("AssignedByUserId");
        const assignerWidget = assigner.tryGetWidget<any>();
        if (!this.isNew() || (assignerWidget && EditorUtils.getValue(assignerWidget)))
            return;

        const user = getRemoteData("UserData") as any;
        const userId = this.toNumber(user?.UserId ?? user?.Id);
        if (userId == null && !user?.Username && !user?.DisplayName)
            return;

        let lookup: any;
        try {
            lookup = await getLookupAsync<any>("Administration.User");
        }
        catch {
            return;
        }

        if (!this.isNew() || (assignerWidget && EditorUtils.getValue(assignerWidget)))
            return;

        const idField = lookup?.idField ?? "UserId";
        const item = lookup?.items?.find((x: any) =>
            (userId != null && this.toNumber(x[idField]) === userId) ||
            x.Username === user?.Username || x.DisplayName === user?.DisplayName);
        const selectedId = item?.[idField];
        if (selectedId != null)
            EditorUtils.setValue(assignerWidget ?? assigner, selectedId);
    }

    private syncScheduleEditors() {
        const allDayNode = this.byId("IsAllDay")?.getNode() as HTMLElement | null;
        const allDayInput = allDayNode?.matches("input[type=checkbox]")
            ? allDayNode as HTMLInputElement
            : allDayNode?.querySelector<HTMLInputElement>("input[type=checkbox]");
        if (allDayInput && !allDayInput.dataset.scheduleBound) {
            allDayInput.dataset.scheduleBound = "1";
            allDayInput.addEventListener("change", () => {
                this.scheduleEditorMode = null;
                this.syncScheduleEditors();
            });
        }
        if (!allDayInput)
            return;

        const allDay = allDayInput.checked;
        if (this.scheduleEditorMode === allDay)
            return;

        const fields = (this.propertyGrid as any)?.fieldElements as Array<any> | undefined;
        if (!fields)
            return;

        for (const name of ["StartDate", "DueDate"]) {
            const fieldElement = fields.find(x => x.propertyItem?.name === name);
            const oldWidget = fieldElement?.editorWidget ?? tryGetWidget<any>(this.byId(name));
            if (!fieldElement || !oldWidget)
                return;

            const value = EditorUtils.getValue(oldWidget);
            const oldInput = oldWidget.domNode as HTMLInputElement;
            const field = fieldElement as HTMLElement;
            const item = fieldElement.propertyItem;
            const inputId = oldInput?.id || `${this.propertyGrid.get_idPrefix()}${name}`;
            const inputName = oldInput?.getAttribute("name") || name;
            const placeholder = oldInput?.getAttribute("placeholder");
            const inputClass = oldInput
                ? Array.from(oldInput.classList)
                    .filter(x => ![
                        "s-Serenity-DateEditor", "s-DateEditor",
                        "s-Serenity-DateTimeEditor", "s-DateTimeEditor",
                        "dateTimeQ", "flatpickr-input", "customValidate"
                    ].includes(x))
                    .join(" ") || "editor"
                : "editor";
            const editorParams = { ...(item?.editorParams ?? {}) };
            const widgetOptions = {
                ...editorParams,
                id: inputId,
                element: undefined
            };

            oldWidget?.destroy?.();

            const caption = field.querySelector(".caption");
            Array.from(field.children).forEach(child => {
                if (child !== caption)
                    child.remove();
            });

            const newInput = document.createElement("input");
            newInput.type = "text";
            newInput.id = inputId;
            newInput.name = inputName;
            newInput.className = inputClass;
            if (placeholder)
                newInput.setAttribute("placeholder", placeholder);
            field.appendChild(newInput);

            const widget = allDay
                ? new DateEditor({ ...widgetOptions, element: newInput }).init()
                : new DateTimeEditor({ ...widgetOptions, element: newInput }).init();
            EditorUtils.setValue(widget, value);
            fieldElement.editorWidget = widget;
            delete fieldElement.editorPromise;
            (this.propertyGrid as any).updateFieldElement(fieldElement);
        }

        this.scheduleEditorMode = allDay;
    }

    private scheduleScheduleEditorSync() {
        if (this.scheduleEditorSyncTimer != null)
            window.clearTimeout(this.scheduleEditorSyncTimer);

        this.scheduleEditorSyncTimer = window.setTimeout(() => {
            this.scheduleEditorSyncTimer = undefined;
            if (this.domNode?.isConnected) {
                this.syncScheduleEditors();
                void this.setCurrentUserAsAssigner();
                void this.setDefaultSortOrder();
            }
        }, 0);
    }

    private async setDefaultSortOrder() {
        const sortOrder = this.byId("SortOrder");
        const sortOrderWidget = sortOrder.tryGetWidget<any>();
        if (!this.isNew() || (sortOrderWidget && EditorUtils.getValue(sortOrderWidget)))
            return;

        if (sortOrderWidget)
            EditorUtils.setValue(sortOrderWidget, 10);

        try {
            const response = await serviceCall<any>({
                service: "Todo/TaskItem/NextSortOrder",
                request: {}
            });
            if (!this.isNew())
                return;

            const nextSortOrder = Number(response?.SortOrder ?? response?.sortOrder);
            if (Number.isFinite(nextSortOrder))
                EditorUtils.setValue(sortOrderWidget ?? sortOrder, nextSortOrder);
        }
        catch {
            // The save handler calculates the authoritative value as well.
        }
    }

    private toNumber(value: any) {
        if (value == null || value === "")
            return null;

        const result = Number(value);
        return Number.isFinite(result) ? result : null;
    }
}
