import { Attributes } from "@serenity-is/corelib";
import { EditorSampleDialog } from "../../Common/EditorSampleDialog";
import { SampleInfo } from "../../Common/SampleInfo";
import { NumberPhoneAndMonthForm } from "../../ServerTypes/NumberPhoneAndMonthForm";

export default function pageInit() {
    SampleInfo({
        uses: ["NumericStepperEditor", "PhoneEditor", "MonthYearEditor"]
    });

    new NumberPhoneAndMonthDialog({}).mount();
}

export class NumberPhoneAndMonthDialog extends EditorSampleDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.NumberPhoneAndMonthDialog", [Attributes.panel]);

    protected override getFormKey() { return NumberPhoneAndMonthForm.formKey; }

    protected override loadInitialEntity() {
        this.propertyGrid.load({ Seats: 5, ContractStart: "2026-11" });
    }
}
