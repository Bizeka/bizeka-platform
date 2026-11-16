import { Attributes } from "@serenity-is/corelib";
import { EditorSampleDialog } from "../../Common/EditorSampleDialog";
import { sampleText, SampleInfo } from "../../Common/SampleInfo";
import { StaticTextForm } from "../../ServerTypes/StaticTextForm";

export default function pageInit() {
    SampleInfo({
        uses: ["StaticTextBlock"]
    });

    new StaticTextDialog({}).mount();
}

export class StaticTextDialog extends EditorSampleDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.StaticTextDialog", [Attributes.panel]);

    protected override getFormKey() { return StaticTextForm.formKey; }

    protected override loadInitialEntity() {
        this.propertyGrid.load({
            LastReviewed: "2026-10-20",
            ReviewerNote: sampleText("StaticText.LooksGood") + "<script>alert('x')</script> <span onmouseover=\"alert('y')\">"
                + sampleText("StaticText.HoverMe") + "</span>"
        });
    }
}
