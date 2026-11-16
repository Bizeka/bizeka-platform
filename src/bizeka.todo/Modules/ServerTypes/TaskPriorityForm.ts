import { ColorHexEditor } from "@bizeka/extensions";
import { BooleanEditor, initFormType, IntegerEditor, PrefixedContext, StringEditor } from "@serenity-is/corelib";

export interface TaskPriorityForm {
    Name: StringEditor;
    SortOrder: IntegerEditor;
    Color: ColorHexEditor;
    IsActive: BooleanEditor;
}

export class TaskPriorityForm extends PrefixedContext {
    static readonly formKey = 'Todo.TaskPriority';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!TaskPriorityForm.init) {
            TaskPriorityForm.init = true;

            initFormType(TaskPriorityForm, [
                'Name', StringEditor,
                'SortOrder', IntegerEditor,
                'Color', ColorHexEditor,
                'IsActive', BooleanEditor
            ]);
        }
    }
}