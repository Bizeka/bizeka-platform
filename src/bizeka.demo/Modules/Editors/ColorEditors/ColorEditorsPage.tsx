import { Attributes } from "@serenity-is/corelib";
import { EditorSampleDialog } from "../../Common/EditorSampleDialog";
import { sampleText, SampleInfo } from "../../Common/SampleInfo";
import { ColorEditorsForm } from "../../ServerTypes/ColorEditorsForm";

export default function pageInit() {
    SampleInfo({
        uses: ["ColorHexEditor", "ColorPickerEditor"]
    });

    const dialog = new ColorEditorsDialog({}).mount();
    dialog.form.BrandColor.element.on("change", () => dialog.updatePreview());
    dialog.form.HighlightColor.element.on("change", () => dialog.updatePreview());
    dialog.updatePreview();
}

export class ColorEditorsDialog extends EditorSampleDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.ColorEditorsDialog", [Attributes.panel]);

    protected override getFormKey() { return ColorEditorsForm.formKey; }

    readonly form = new ColorEditorsForm(this.idPrefix);

    private readonly preview = <div class="mt-3 p-3 rounded border">{sampleText("ColorEditors.PreviewOfTheChosenColors")}</div> as HTMLElement;

    protected override loadInitialEntity() {
        this.propertyGrid.load({ BrandColor: "#5267ed", HighlightColor: "#fde68a" });
    }

    override mount() {
        super.mount();
        this.output.before(this.preview);
        return this;
    }

    updatePreview() {
        this.preview.style.color = this.form.BrandColor.value || "";
        this.preview.style.borderColor = this.form.BrandColor.value || "";
        this.preview.style.backgroundColor = this.form.HighlightColor.value || "";
    }
}
