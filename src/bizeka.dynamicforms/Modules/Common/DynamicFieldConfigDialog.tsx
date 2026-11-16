import { BaseDialog, BooleanEditor, EditorUtils, IntegerEditor, SelectEditor, StringEditor, localText, notifyWarning, stringFormat, tryGetWidget } from "@serenity-is/corelib";

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

export class DynamicFieldConfigDialog extends BaseDialog<DynamicFieldConfigDialogOptions> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.DynamicForms.DynamicFieldConfigDialog");

    private static readonly fieldNameRegex = /^[A-Za-z0-9]+$/;
    private text(key: string, fallback: string) {
        return localText(`Site.DynamicForms.${key}`, localText(`Site.DynamicForms.${key}`, fallback));
    }

    protected override getInitialDialogTitle() {
        return this.options?.initialData?.Name
            ? stringFormat(this.text("FieldConfig.EditField", "Edit Field: {0}"), this.options.initialData.Name)
            : this.text("FieldConfig.NewField", "New Field");
    }

    protected override getDialogOptions() {
        const base = super.getDialogOptions();
        return {
            ...base,
            dialogClass: ((base.dialogClass ?? "") + " s-DynamicFieldConfigDialog").trim(),
            width: Math.min(window.innerWidth * 0.95, 620)
        };
    }

    protected override getDialogButtons() {
        return [
            {
                text: this.text("FieldConfig.Save", "Save"),
                cssClass: "btn btn-primary",
                click: () => this.saveClick()
            },
            {
                text: this.text("FieldConfig.Cancel", "Cancel"),
                cssClass: "btn btn-secondary",
                click: () => this.dialogClose()
            }
        ];
    }

    protected override renderContents() {
        const data = this.options.initialData || {};

        return (
            <div class="s-Form dynamic-field-config-form">
                <div class="field">
                    <label class="caption" for={this.idPrefix + "Name"}>{this.text("FieldConfig.FieldName", "Field Name")}</label>
                    <input id={this.idPrefix + "Name"} class="editor s-StringEditor form-control" value={data.Name ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "Caption"}>{this.text("FieldConfig.Caption", "Caption")}</label>
                    <input id={this.idPrefix + "Caption"} class="editor s-StringEditor form-control" value={data.Caption ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "Type"}>{this.text("FieldConfig.Type", "Type")}</label>
                    <input id={this.idPrefix + "Type"} class="editor" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "Tab"}>{this.text("FieldConfig.Tab", "Tab")}</label>
                    <input id={this.idPrefix + "Tab"} class="editor s-StringEditor form-control" value={data.Tab ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "MaxLength"}>{this.text("FieldConfig.MaxLength", "Max Length")}</label>
                    <input id={this.idPrefix + "MaxLength"} class="editor s-IntegerEditor form-control" type="text" min="0" value={data.MaxLength?.toString() ?? ""} />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "MinValue"}>{this.text("FieldConfig.MinValue", "Min Value")}</label>
                    <input id={this.idPrefix + "MinValue"} class="editor s-StringEditor form-control" value={data.MinValue ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "MaxValue"}>{this.text("FieldConfig.MaxValue", "Max Value")}</label>
                    <input id={this.idPrefix + "MaxValue"} class="editor s-StringEditor form-control" value={data.MaxValue ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "DecimalDigits"}>{this.text("FieldConfig.DecimalDigits", "Decimal Digits")}</label>
                    <input id={this.idPrefix + "DecimalDigits"} class="editor s-IntegerEditor form-control" type="text" min="0" value={data.DecimalDigits?.toString() ?? ""} />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "TextRows"}>{this.text("FieldConfig.TextRows", "Text Rows")}</label>
                    <input id={this.idPrefix + "TextRows"} class="editor s-IntegerEditor form-control" type="text" min="1" value={data.TextRows?.toString() ?? ""} />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "Placeholder"}>{this.text("FieldConfig.Placeholder", "Placeholder")}</label>
                    <input id={this.idPrefix + "Placeholder"} class="editor s-StringEditor form-control" value={data.Placeholder ?? ""} autocomplete="off" />
                </div>
                <div class="field">
                    <label class="caption" for={this.idPrefix + "DefaultValue"}>{this.text("FieldConfig.DefaultValue", "Default Value")}</label>
                    <input id={this.idPrefix + "DefaultValue"} class="editor s-StringEditor form-control" value={data.DefaultValue ?? ""} autocomplete="off" />
                </div>
                <div class="field field-checkbox">
                    <label class="caption" for={this.idPrefix + "Required"}>{this.text("FieldConfig.Required", "Required")}</label>
                    <div class="editor flex-layout">
                        <input id={this.idPrefix + "Required"} type="checkbox" class="editor s-BooleanEditor form-check-input" checked={data.Required ?? false} />
                    </div>
                </div>
                <div class="field field-checkbox">
                    <label class="caption" for={this.idPrefix + "ReadOnly"}>{this.text("FieldConfig.ReadOnly", "Read Only")}</label>
                    <div class="editor flex-layout">
                        <input id={this.idPrefix + "ReadOnly"} type="checkbox" class="editor s-BooleanEditor form-check-input" checked={data.ReadOnly ?? false} />
                    </div>
                </div>
            </div>
        );
    }

    protected override onDialogOpen() {
        super.onDialogOpen();
        const data = this.options.initialData || {};

        const setVal = (id: string, val: any) => {
            const el = this.input(id);
            if (el) el.value = val != null ? String(val) : "";
        };

        setVal("Name", data.Name);
        setVal("Caption", data.Caption);
        setVal("Tab", data.Tab);
        setVal("MaxLength", data.MaxLength);
        setVal("MinValue", data.MinValue);
        setVal("MaxValue", data.MaxValue);
        setVal("DecimalDigits", data.DecimalDigits);
        setVal("TextRows", data.TextRows);
        setVal("Placeholder", data.Placeholder);
        setVal("DefaultValue", data.DefaultValue);

        const typeEditor = new SelectEditor({ element: this.editorElement("Type"), items: [
            ["1", this.text("Type.String", "String")], ["2", this.text("Type.Integer", "Integer")],
            ["3", this.text("Type.Decimal", "Decimal")], ["4", this.text("Type.Date", "Date")],
            ["8", this.text("Type.DateTime", "Date Time")], ["5", this.text("Type.Boolean", "Boolean")],
            ["6", this.text("Type.Lookup", "Lookup")], ["7", this.text("Type.TextArea", "Text Area")],
            ["9", this.text("Type.HtmlContent", "HTML Content")]
        ] });
        typeEditor.value = String(data.Type ?? "1");
        typeEditor.element.on("change", () => this.updateFieldStates());
        for (const name of ["Name", "Caption", "Tab", "MinValue", "MaxValue", "Placeholder", "DefaultValue"]) {
            const editor = new StringEditor({ element: this.editorElement(name) });
            editor.value = data[name] ?? "";
        }
        for (const name of ["MaxLength", "DecimalDigits", "TextRows"]) {
            const editor = new IntegerEditor({ element: this.editorElement(name), minValue: 0 });
            editor.value = data[name] ?? null;
        }
        for (const name of ["Required", "ReadOnly"]) {
            const editor = new BooleanEditor({ element: this.editorElement(name) });
            editor.value = Boolean(data[name]);
        }

        this.updateFieldStates();
    }

    private saveClick() {
        const decimalDigits = this.parseIntValue("DecimalDigits");
        const textRows = this.parseIntValue("TextRows");
        const minValue = this.input("MinValue")?.value?.trim() || undefined;
        const maxValue = this.input("MaxValue")?.value?.trim() || undefined;
        const type = this.select("Type")?.value ?? "1";

        const data: DynamicFieldDef = {
            ...this.options.initialData,
            Name: this.input("Name")?.value?.trim() ?? "",
            Caption: this.input("Caption")?.value?.trim() ?? "",
            Type: type,
            Tab: this.input("Tab")?.value?.trim() || undefined,
            MaxLength: this.parseIntValue("MaxLength"),
            MinValue: minValue,
            MaxValue: maxValue,
            DecimalDigits: decimalDigits,
            TextRows: textRows,
            Placeholder: this.input("Placeholder")?.value?.trim() || undefined,
            DefaultValue: this.input("DefaultValue")?.value?.trim() || undefined,
            Required: !!this.checkbox("Required")?.checked,
            ReadOnly: !!this.checkbox("ReadOnly")?.checked
        };

        if (!data.Name || !data.Caption || !data.Type) {
            notifyWarning(this.text("FieldConfig.ValidationRequired", "Field name, caption and type are required."));
            return;
        }

        if (!DynamicFieldConfigDialog.fieldNameRegex.test(data.Name)) {
            notifyWarning(this.text("FieldConfig.ValidationFieldName", "Field name may only contain letters and numbers, without spaces or special characters."));
            return;
        }

        if (data.Type === "3" && decimalDigits != null && decimalDigits < 0) {
            notifyWarning(this.text("FieldConfig.ValidationDecimalDigits", "Decimal digits must be zero or greater."));
            return;
        }

        if (data.Type === "7" && textRows != null && textRows < 2) {
            notifyWarning(this.text("FieldConfig.ValidationTextRows", "Text rows must be at least 2."));
            return;
        }

        if (this.isNumericType(type) && minValue && maxValue && Number(minValue) > Number(maxValue)) {
            notifyWarning(this.text("FieldConfig.ValidationNumericRange", "Min value can not be greater than max value."));
            return;
        }

        this.options.onSave(data);
        this.dialogClose();
    }

    private input(id: string): HTMLInputElement | null {
        return this.findById<HTMLInputElement>(id) ?? this.domNode?.querySelector<HTMLInputElement>(`#${this.idPrefix}${id}`) ?? null;
    }

    /** Inputs rendered by renderContents; a missing one is a programming error, not a user state. */
    private editorElement(id: string): HTMLInputElement {
        const element = this.input(id);
        if (!element) throw new Error(`Dynamic field editor input "${id}" was not rendered.`);
        return element;
    }

    private select(id: string): HTMLInputElement | null {
        return this.input(id);
    }

    private checkbox(id: string): HTMLInputElement | null {
        return this.input(id);
    }

    private updateFieldStates() {
        const typeEl = this.select("Type");
        const type = typeEl?.value ?? "1";
        const isInteger = type === "2";
        const isDecimal = type === "3";
        const isDate = type === "4" || type === "8";
        const isLongText = type === "7";
        const supportsLength = type === "1" || type === "7";
        const supportsMinMax = isInteger || isDecimal || isDate;
        this.setFieldVisible("MaxLength", supportsLength);
        this.setFieldVisible("MinValue", supportsMinMax);
        this.setFieldVisible("MaxValue", supportsMinMax);
        this.setFieldVisible("DecimalDigits", isDecimal);
        this.setFieldVisible("TextRows", isLongText);

        const setDisabled = (id: string, disabled: boolean) => {
            const el = this.input(id);
            if (el) el.disabled = disabled;
        };

        setDisabled("MaxLength", !supportsLength);
        setDisabled("MinValue", !supportsMinMax);
        setDisabled("MaxValue", !supportsMinMax);
        setDisabled("DecimalDigits", !isDecimal);
        setDisabled("TextRows", !isLongText);
    }

    private parseIntValue(id: string) {
        const editor = tryGetWidget<IntegerEditor>(this.editorElement(id));
        const value = editor ? EditorUtils.getValue(editor) : null;
        return value == null || value === "" ? undefined : Number(value);
    }

    private isNumericType(type: string) {
        return type === "2" || type === "3";
    }

    private setFieldVisible(id: string, visible: boolean) {
        const input = this.findById<HTMLElement>(id) ?? this.domNode?.querySelector<HTMLElement>(`#${this.idPrefix}${id}`);
        const field = input?.closest(".field") as HTMLElement | null;
        if (!field)
            return;

        field.style.display = visible ? "" : "none";
    }
}
