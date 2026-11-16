import { EntityGrid } from "@serenity-is/corelib";
import { DynamicFormDefinitionDialog } from "./DynamicFormDefinitionDialog";
export declare class DynamicFormDefinitionGrid extends EntityGrid<any, any> {
    static [Symbol.typeInfo]: import("@serenity-is/corelib").ClassTypeInfo<"Bizeka.DynamicForms.">;
    protected getColumnsKey(): string;
    protected getDialogType(): typeof DynamicFormDefinitionDialog;
    protected getIdProperty(): string;
    protected getLocalTextPrefix(): string;
    protected getService(): string;
    protected getDefaultSortBy(): string[];
}
