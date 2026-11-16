import type { DynamicFieldDef } from "@bizeka/extensions";
import { Attributes, notifyInfo } from "@serenity-is/corelib";
import { InMemoryJsonDialog } from "../../Common/InMemoryJsonDialog";
import { sampleText, SampleInfo, samplePanel } from "../../Common/SampleInfo";
import { SchemaFieldsForm } from "../../ServerTypes/SchemaFieldsForm";

const schema: DynamicFieldDef[] = [
    { Name: "Venue", Caption: sampleText("JsonRoundTrip.Venue"), Type: "1", MaxLength: 100 },
    { Name: "Capacity", Caption: sampleText("JsonRoundTrip.Capacity"), Type: "2" },
    { Name: "Outdoor", Caption: sampleText("JsonRoundTrip.Outdoor"), Type: "5" }
];

/** What a retrieve service would return for a row that inherits JsonDataRow. */
const storedRecord = {
    Id: 42,
    EventName: sampleText("JsonRoundTrip.AutumnMeetup"),
    Organizer: sampleText("JsonRoundTrip.PlatformTeam"),
    DynamicDataJson: JSON.stringify({ Venue: sampleText("JsonRoundTrip.HarbourHall"), Capacity: 180, Outdoor: false, RetiredField: "kept" })
};

export default function pageInit() {
    SampleInfo({
        uses: ["JsonDataDialog"]
    });

    const dialog = new JsonRoundTripDialog();
    samplePanel().append(<p class="d-flex gap-2 flex-wrap">
        <button type="button" class="btn btn-sm btn-outline-secondary" onClick={() => dialog.mount(storedRecord)}>
            {sampleText("JsonRoundTrip.ReloadStoredRecord")}</button>
        <button type="button" class="btn btn-sm btn-outline-secondary" onClick={() => {
            dialog.mount({ ...storedRecord, DynamicDataJson: "{ not json" });
            notifyInfo(sampleText("JsonRoundTrip.LoadedARecordWhoseJSONCannot"));
        }}>{sampleText("JsonRoundTrip.LoadMalformedJSON")}</button>
    </p>);
    dialog.mount(storedRecord);
}

export class JsonRoundTripDialog extends InMemoryJsonDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.JsonRoundTripDialog", [Attributes.panel]);

    protected override getFormKey() { return SchemaFieldsForm.formKey; }

    protected override getDynamicSchema() { return schema; }
}
