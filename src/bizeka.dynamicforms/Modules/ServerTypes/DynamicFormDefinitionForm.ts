import { BooleanEditor, initFormType, PrefixedContext, StringEditor } from "@serenity-is/corelib";
import { DynamicFieldsEditor } from "../Common/DynamicFieldsEditor";

export interface DynamicFormDefinitionForm {
    FormKey: StringEditor;
    DefinitionJson: DynamicFieldsEditor;
    Description: StringEditor;
    IsActive: BooleanEditor;
}

export class DynamicFormDefinitionForm extends PrefixedContext {
    static readonly formKey = 'DynamicForms.DynamicFormDefinition';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!DynamicFormDefinitionForm.init) {
            DynamicFormDefinitionForm.init = true;

            initFormType(DynamicFormDefinitionForm, [
                'FormKey', StringEditor,
                'DefinitionJson', DynamicFieldsEditor,
                'Description', StringEditor,
                'IsActive', BooleanEditor
            ]);
        }
    }
}