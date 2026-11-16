import { MonthYearEditor, NumericStepperEditor, PhoneEditor } from "@bizeka/extensions";
import { initFormType, PrefixedContext } from "@serenity-is/corelib";

export interface NumberPhoneAndMonthForm {
    Seats: NumericStepperEditor;
    OfficePhone: PhoneEditor;
    OtherPhones: PhoneEditor;
    ContractStart: MonthYearEditor;
}

export class NumberPhoneAndMonthForm extends PrefixedContext {
    static readonly formKey = 'Demo.Editors.NumberPhoneAndMonth';
    declare private static init: boolean;

    constructor(...args: ConstructorParameters<typeof PrefixedContext>) {
        super(...args);

        if (!NumberPhoneAndMonthForm.init) {
            NumberPhoneAndMonthForm.init = true;

            initFormType(NumberPhoneAndMonthForm, [
                'Seats', NumericStepperEditor,
                'OfficePhone', PhoneEditor,
                'OtherPhones', PhoneEditor,
                'ContractStart', MonthYearEditor
            ]);
        }
    }
}