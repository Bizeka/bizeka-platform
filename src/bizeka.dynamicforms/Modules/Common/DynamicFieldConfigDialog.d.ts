import { BaseDialog } from "@serenity-is/corelib";
export interface DynamicFieldDef {
    Name?: string;
    Caption?: string;
    Type?: string;
    Required?: boolean;
    MaxLength?: number;
    MinValue?: string;
    MaxValue?: string;
    DecimalDigits?: number;
    TextRows?: number;
    Tab?: string;
    Placeholder?: string;
    DefaultValue?: string;
    ReadOnly?: boolean;
    __id?: number;
}
export interface DynamicFieldConfigDialogOptions {
    initialData: DynamicFieldDef;
    onSave: (data: DynamicFieldDef) => void;
}
export declare class DynamicFieldConfigDialog extends BaseDialog<DynamicFieldConfigDialogOptions> {
    static [Symbol.typeInfo]: import("@serenity-is/corelib").ClassTypeInfo<"Bizeka.DynamicForms.">;
    private static readonly fieldNameRegex;
    private text;
    protected getInitialDialogTitle(): string;
    protected getDialogOptions(): {
        width: number;
        autoDispose?: boolean;
        autoOpen?: boolean;
        backdrop?: boolean | "static";
        buttons?: import("@serenity-is/corelib").DialogButton[];
        centered?: boolean;
        closeButton?: boolean;
        closeOnEscape?: boolean;
        dialogClass?: string;
        element?: HTMLElement | ArrayLike<HTMLElement> | ((element: HTMLElement) => void);
        fade?: boolean;
        fullScreen?: boolean | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down";
        modal?: boolean;
        onOpen?: (e?: Event) => void;
        onClose?: (result: string, e?: Event) => void;
        preferBSModal?: boolean;
        preferPanel?: boolean;
        providerOptions?: (type: import("@serenity-is/corelib").DialogProviderType, opt: import("@serenity-is/corelib").DialogOptions) => any;
        scrollable?: boolean;
        size?: "sm" | "md" | "lg" | "xl";
        title?: string;
    };
    protected getDialogButtons(): ({
        text: string;
        cssClass: string;
        click: () => void;
    } | {
        text: string;
        click: () => void;
        cssClass?: undefined;
    })[];
    protected renderContents(): import("@serenity-is/domwise").JSXElement;
    protected onDialogOpen(): void;
    private saveClick;
    private input;
    private select;
    private checkbox;
    private updateFieldStates;
    private parseIntValue;
    private isNumericType;
    private setFieldVisible;
}
