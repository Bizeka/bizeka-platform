import { afterEach, describe, expect, it } from "vitest";
import { EditorUtils, StringEditor } from "@serenity-is/corelib";
import { JsonDataDialog } from "../../Modules/Common/JsonDataDialog";

let releaseItems: () => void;
let itemsReady: Promise<void>;

class AsyncRecordDialog extends JsonDataDialog<{ Id?: number; Summary?: string }> {
    protected override useAsync() { return true; }
    protected override getFormKey() { return ""; }
    protected override getIdProperty() { return "Id"; }
    protected override getNameProperty() { return "Summary"; }
    protected override getDynamicSchema() { return []; }
    protected override async getPropertyItemsDataAsync() {
        await itemsReady;
        return { items: [{ name: "Summary", editorType: StringEditor }], additionalItems: [] };
    }
}

describe("async JSON form loading", () => {
    let dialog: AsyncRecordDialog;
    afterEach(() => dialog?.destroy());

    it.each([{ Summary: "New draft" }, { Id: 42, Summary: "Existing record" }])(
        "preserves a record loaded before property items: %j", async entity => {
            itemsReady = new Promise<void>(resolve => { releaseItems = resolve; });
            dialog = new AsyncRecordDialog({});
            dialog.loadResponse({ Entity: entity });
            expect(dialog.byId("Summary").getNode()).toBeNull();
            releaseItems();
            await new Promise(resolve => setTimeout(resolve, 0));
            const editor = dialog.byId("Summary").getWidget<StringEditor>();
            expect(EditorUtils.getValue(editor)).toBe(entity.Summary);
        });
});
