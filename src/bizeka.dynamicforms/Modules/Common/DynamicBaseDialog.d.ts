import { EntityDialog, PropertyItem } from "@serenity-is/corelib";
import type { DynamicFieldDef } from "./DynamicFieldConfigDialog";
export interface DynamicFormDefinitionRow {
    Id?: number;
    FormKey?: string;
    DefinitionJson?: string;
}
export declare class DynamicBaseDialog<TRow, TOptions> extends EntityDialog<TRow, TOptions> {
    static [Symbol.typeInfo]: import("@serenity-is/corelib").ClassTypeInfo<"Bizeka.DynamicForms.">;
    protected text(key: string, fallback: string): string;
    protected getDynamicFormLookupKey(): string;
    protected getDynamicSchemaFormKey(): string;
    protected getDesignService(): string;
    protected handlesAdditionalFieldType(type: string): boolean;
    protected getToolbarButtons(): import("@serenity-is/corelib").ToolButton[];
    protected getPropertyItems(): PropertyItem[];
    protected loadEntity(entity: TRow): void;
    protected getSaveEntity(): any;
    protected getDynamicSchema(): DynamicFieldDef[];
    protected toPropertyItem(item: DynamicFieldDef): PropertyItem;
    protected hasRegisteredLookup(lookupKey: string): boolean;
    protected parseNumberValue(value?: string): number;
    protected cleanEditorParams(params: Record<string, any>): {
        [k: string]: any;
    };
    protected createFieldDesignerDialog(): any;
    protected openFieldDesigner(): void;
}
