import { LookupEditorBase, LookupEditorOptions, Select2Item, Lookup } from "@serenity-is/corelib";

export class EmptyLookupEditor extends LookupEditorBase<LookupEditorOptions, any> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.EmptyLookupEditor");

    // No lookup script stands behind this editor; items come only from setSelect2Items or setLookupItems.
    // The base class would otherwise request the script "Lookup.Extensions.EmptyLookup" and fail.
    public override updateItems() {
        this.clearItems();
    }

    public setSelect2Items(items: Select2Item[]) {
        this.clearItems();
        if (items) {
            items.forEach(item => { this.addItem(item); });
        }
    }

    public setLookupItems(lookup: Lookup<any>) {
        let items = lookup.items.map<Select2Item>(m => {
            return {
                id: (m as any)[lookup.idField!],
                text: (m as any)[lookup.textField!],
                source: m
            };
        });
        this.setSelect2Items(items);
    }
}
