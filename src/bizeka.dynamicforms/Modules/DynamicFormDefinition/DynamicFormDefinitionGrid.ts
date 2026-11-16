import { DynamicFormDefinitionRow } from "../ServerTypes/DynamicFormDefinitionRow";
import { EntityGrid } from "@serenity-is/corelib";
import { DynamicFormDefinitionDialog } from "./DynamicFormDefinitionDialog";

export class DynamicFormDefinitionGrid<P = {}> extends EntityGrid<DynamicFormDefinitionRow, P> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.DynamicForms.DynamicFormDefinitionGrid");

    protected override getColumnsKey() { return "DynamicForms.DynamicFormDefinition"; }
    protected override getDialogType() { return DynamicFormDefinitionDialog; }
    protected override getRowDefinition() { return DynamicFormDefinitionRow; }
    protected override getIdProperty() { return "Id"; }
    protected override getLocalTextPrefix() { return "DynamicForms.DynamicFormDefinition"; }
    protected override getService() { return "DynamicForms/DynamicFormDefinition"; }
    protected override getDefaultSortBy() { return ["FormKey"]; }
}
