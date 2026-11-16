import { IGetEditValue, ISetEditValue, PropertyItem, Widget, WidgetProps } from "@serenity-is/corelib";
export declare class DynamicFieldsEditor<P = {}> extends Widget<P> implements IGetEditValue, ISetEditValue {
    static [Symbol.typeInfo]: import("@serenity-is/corelib").EditorTypeInfo<"Bizeka.DynamicForms.DynamicFieldsEditor">;
    private items;
    private nextId;
    private host;
    private listHost;
    private text;
    constructor(props: WidgetProps<P>);
    getEditValue(property: PropertyItem, target: any): void;
    setEditValue(source: any, property: PropertyItem): void;
    private initializeLayout;
    private addNewItem;
    private editItem;
    private deleteItem;
    private renderList;
    private encode;
}
