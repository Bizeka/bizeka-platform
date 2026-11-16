import { DynamicFormDefinitionRow } from "../ServerTypes/DynamicFormDefinitionRow";
import { EntityDialog } from "@serenity-is/corelib";
import "../Common/DynamicFieldsEditor";

export class DynamicFormDefinitionDialog extends EntityDialog<DynamicFormDefinitionRow> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.DynamicForms.DynamicFormDefinitionDialog");

    protected override getFormKey() { return "DynamicForms.DynamicFormDefinition"; }
    protected override getRowDefinition() { return DynamicFormDefinitionRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "DynamicForms.DynamicFormDefinition"; }
    protected override getNameProperty() { return "FormKey"; }
    protected override getService() { return "DynamicForms/DynamicFormDefinition"; }

    private _formKeyFixed: boolean = false;

    protected override afterLoadEntity() {
        super.afterLoadEntity();

        const editor = this.byId("FormKey");
        if (!this.isNew() || this._formKeyFixed) {
            editor.attr("readonly", "readonly");
            editor.attr("tabindex", "-1");
        } else {
            editor.removeAttr("readonly");
            editor.removeAttr("tabindex");
        }
    }

    public setFormKey(value: string) {
        this._formKeyFixed = true;
        const editor = this.byId("FormKey");
        editor.attr("readonly", "readonly");
        editor.attr("tabindex", "-1");
        editor.val(value);
        editor.trigger("change");
    }
}
