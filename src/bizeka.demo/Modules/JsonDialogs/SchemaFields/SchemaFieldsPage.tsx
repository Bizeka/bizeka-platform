import type { DynamicFieldDef } from "@bizeka/extensions";
import { Attributes } from "@serenity-is/corelib";
import { InMemoryJsonDialog } from "../../Common/InMemoryJsonDialog";
import { sampleText, SampleInfo } from "../../Common/SampleInfo";
import { SchemaFieldsForm } from "../../ServerTypes/SchemaFieldsForm";

const details = sampleText("SchemaFields.Details");
const schedule = sampleText("SchemaFields.Schedule");

/**
 * One field of every supported type. Type codes: 1 text, 2 integer, 3 decimal, 4 date,
 * 5 boolean, 7 multi-line text, 8 date and time.
 */
const schema: DynamicFieldDef[] = [
    { Name: "Venue", Caption: sampleText("SchemaFields.Venue"), Type: "1", Required: true, MaxLength: 100, Tab: details },
    { Name: "Capacity", Caption: sampleText("SchemaFields.Capacity"), Type: "2", MinValue: "1", MaxValue: "5000", Tab: details },
    { Name: "TicketPrice", Caption: sampleText("SchemaFields.TicketPrice"), Type: "3", DecimalDigits: 2, MinValue: "0", Tab: details },
    { Name: "Reference", Caption: sampleText("SchemaFields.Reference"), Type: "1", ReadOnly: true, DefaultValue: "EV-2026-014", Tab: details },
    { Name: "EventDate", Caption: sampleText("SchemaFields.EventDate"), Type: "4", Tab: schedule },
    { Name: "DoorsOpen", Caption: sampleText("SchemaFields.DoorsOpen"), Type: "8", Tab: schedule },
    { Name: "Outdoor", Caption: sampleText("SchemaFields.Outdoor"), Type: "5", DefaultValue: "true", Tab: schedule },
    { Name: "Agenda", Caption: sampleText("SchemaFields.Agenda"), Type: "7", TextRows: 4, Placeholder: sampleText("SchemaFields.OneLinePerSession"), Tab: schedule }
];

export default function pageInit() {
    SampleInfo({
        uses: ["JsonDataDialog", "DynamicFieldDef", "JsonDataRow"]
    });

    new SchemaFieldsDialog().mount({});
}

export class SchemaFieldsDialog extends InMemoryJsonDialog {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.SchemaFieldsDialog", [Attributes.panel]);

    protected override getFormKey() { return SchemaFieldsForm.formKey; }

    protected override getDynamicSchema() { return schema; }
}
