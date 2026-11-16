import { Attributes } from "@serenity-is/corelib";
import { EditorSampleDialog } from "../../Common/EditorSampleDialog";
import { sampleText, SampleInfo } from "../../Common/SampleInfo";
import { TagsAndSuggestionsForm } from "../../ServerTypes/TagsAndSuggestionsForm";

export default function pageInit() {
    SampleInfo({
        uses: ["TagListEditor", "AutoCompleteEditor", "EmptyLookupEditor"]
    });

    const dialog = new TagsAndSuggestionsDialog({}).mount();
    dialog.form.SalesRegion.setSelect2Items([
        { id: "north", text: sampleText("TagsAndSuggestions.North") },
        { id: "central", text: sampleText("TagsAndSuggestions.Central") },
        { id: "south", text: sampleText("TagsAndSuggestions.South") }
    ]);
}

export class TagsAndSuggestionsDialog extends EditorSampleDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.TagsAndSuggestionsDialog", [Attributes.panel]);

    protected override getFormKey() { return TagsAndSuggestionsForm.formKey; }

    readonly form = new TagsAndSuggestionsForm(this.idPrefix);

    protected override loadInitialEntity() {
        this.propertyGrid.load({ Labels: [sampleText("TagsAndSuggestions.Priority"), sampleText("TagsAndSuggestions.Renewal")] });
    }
}
