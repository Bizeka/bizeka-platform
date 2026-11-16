import { EntityDialog } from "@serenity-is/corelib";
import "../Common/DynamicFieldsEditor";
export declare class DynamicFormDefinitionDialog extends EntityDialog<any, any> {
    static [Symbol.typeInfo]: import("@serenity-is/corelib").ClassTypeInfo<"Bizeka.DynamicForms.">;
    protected getFormKey(): string;
    protected getIdProperty(): string;
    protected getLocalTextPrefix(): string;
    protected getNameProperty(): string;
    protected getService(): string;
    protected afterLoadEntity(): void;
    setFormKey(value: string): void;
}
