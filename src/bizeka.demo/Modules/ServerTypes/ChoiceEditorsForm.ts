import { BooleanSwitchEditor, CheckboxButtonEditor, YesNoEditor } from "@bizeka/extensions";
import { initFormType, PrefixedContext } from "@serenity-is/corelib";

export interface ChoiceEditorsForm {
    SendSummary: BooleanSwitchEditor;
    CustomerVisible: YesNoEditor;
    DeliveryDays: CheckboxButtonEditor;
}

export class ChoiceEditorsForm extends PrefixedContext {
    static readonly formKey = 'Demo.Editors.ChoiceEditors';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!ChoiceEditorsForm.init) {
            ChoiceEditorsForm.init = true;

            initFormType(ChoiceEditorsForm, [
                'SendSummary', BooleanSwitchEditor,
                'CustomerVisible', YesNoEditor,
                'DeliveryDays', CheckboxButtonEditor
            ]);
        }
    }
}