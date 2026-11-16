import { ColorHexEditor } from "@bizeka/extensions";
import { BooleanEditor, DateEditor, DateTimeEditor, initFormType, IntegerEditor, LookupEditor, PrefixedContext, StringEditor, TextAreaEditor } from "@serenity-is/corelib";

export interface TaskItemForm {
    Summary: StringEditor;
    AssignedByUserId: LookupEditor;
    Assignees: LookupEditor;
    ReferenceNo: StringEditor;
    TagsText: StringEditor;
    SortOrder: IntegerEditor;
    TaskPriorityId: LookupEditor;
    TaskStatusId: LookupEditor;
    StartDate: DateTimeEditor;
    DueDate: DateTimeEditor;
    IsAllDay: BooleanEditor;
    CompletedOn: DateEditor;
    EstimatedMinutes: IntegerEditor;
    ActualMinutes: IntegerEditor;
    Notes: TextAreaEditor;
    Color: ColorHexEditor;
}

export class TaskItemForm extends PrefixedContext {
    static readonly formKey = 'Todo.TaskItem';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!TaskItemForm.init) {
            TaskItemForm.init = true;

            initFormType(TaskItemForm, [
                'Summary', StringEditor,
                'AssignedByUserId', LookupEditor,
                'Assignees', LookupEditor,
                'ReferenceNo', StringEditor,
                'TagsText', StringEditor,
                'SortOrder', IntegerEditor,
                'TaskPriorityId', LookupEditor,
                'TaskStatusId', LookupEditor,
                'StartDate', DateTimeEditor,
                'DueDate', DateTimeEditor,
                'IsAllDay', BooleanEditor,
                'CompletedOn', DateEditor,
                'EstimatedMinutes', IntegerEditor,
                'ActualMinutes', IntegerEditor,
                'Notes', TextAreaEditor,
                'Color', ColorHexEditor
            ]);
        }
    }
}