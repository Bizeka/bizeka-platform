import { initFormType, PrefixedContext, StringEditor } from "@serenity-is/corelib";

export interface SchemaFieldsForm {
    EventName: StringEditor;
    Organizer: StringEditor;
}

export class SchemaFieldsForm extends PrefixedContext {
    static readonly formKey = 'Demo.JsonDialogs.SchemaFields';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!SchemaFieldsForm.init) {
            SchemaFieldsForm.init = true;

            initFormType(SchemaFieldsForm, [
                'EventName', StringEditor,
                'Organizer', StringEditor
            ]);
        }
    }
}