import { ColorHexEditor } from "@bizeka/extensions";
import { BooleanEditor, initFormType, IntegerEditor, PrefixedContext, StringEditor } from "@serenity-is/corelib";

export interface TaskStatusForm {
    Name: StringEditor;
    SortOrder: IntegerEditor;
    Color: ColorHexEditor;
    IsCompleted: BooleanEditor;
    IsActive: BooleanEditor;
}

export class TaskStatusForm extends PrefixedContext {
    static readonly formKey = 'Todo.TaskStatus';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!TaskStatusForm.init) {
            TaskStatusForm.init = true;

            initFormType(TaskStatusForm, [
                'Name', StringEditor,
                'SortOrder', IntegerEditor,
                'Color', ColorHexEditor,
                'IsCompleted', BooleanEditor,
                'IsActive', BooleanEditor
            ]);
        }
    }
}