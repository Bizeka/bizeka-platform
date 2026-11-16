import { Widget, WidgetProps, getLookupAsync, EnumTypeRegistry, localText, tryGetText, PropertyItem } from "@serenity-is/corelib";

export interface CheckboxButtonEditorOptions {
    enumKey?: string;
    enumType?: any;
    lookupKey?: string;
}

export class CheckboxButtonEditor extends Widget<CheckboxButtonEditorOptions> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.CheckboxButtonEditor");

    constructor(props: WidgetProps<CheckboxButtonEditorOptions>) {
        super(props);
        CheckboxButtonEditor.ensureStyles();

        if (!this.options || (!this.options.enumKey && this.options.enumType == null && !this.options.lookupKey)) {
            return;
        }

        if (this.options.lookupKey) {
            void this.loadLookupItems(this.options.lookupKey!);
        } else {
            let enumKey = this.options.enumKey;
            let enumType = this.options.enumType || (enumKey ? EnumTypeRegistry.get(enumKey) : null);
            
            if (enumType) {
                let keys = Object.keys(enumType).filter(v => !isNaN(parseInt(v, 10)));
                for (let x of keys) {
                    let name = enumType[x];
                    let text = tryGetText('Enums.' + enumKey + '.' + name) ?? name;
                    this.addCheckbox(x.toString(), text || '');
                }
            }
        }
    }

    private async loadLookupItems(lookupKey: string): Promise<void> {
        try {
            const lookup = await getLookupAsync<any>(lookupKey);
            for (const item of lookup?.items ?? []) {
                if (!item) continue;
                const textValue = item[lookup.textField];
                const text = textValue == null ? '' : textValue.toString();
                const idValue = item[lookup.idField];
                const id = idValue == null ? '' : idValue.toString();
                this.addCheckbox(id, text);
            }

            if (this.pendingValue !== undefined)
                this.set_value(this.pendingValue);
        }
        catch {
            // A missing or unauthorized lookup leaves the editor empty.
        }
    }

    private pendingValue?: string;

    private static ensureStyles() {
        const styleId = "bzk-checkbox-button-editor-css";
        if (document.getElementById(styleId))
            return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .s-CheckboxButtonEditor {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 4px 20px;
            }
            .s-CheckboxButtonEditor > label {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                min-height: 31px;
                margin: 0;
                cursor: pointer;
            }
        `;
        document.head?.appendChild(style);
    }

    protected addCheckbox(value: string, text: string) {
        if (!this.domNode) return;
        let label = document.createElement('label');
        label.textContent = text || '';
        
        let input = document.createElement('input');
        input.type = 'checkbox';
        input.name = this.uniqueName || 'chk';
        input.id = (this.uniqueName || 'chk') + '_' + value;
        input.value = value || '';
        
        label.prepend(input);
        this.domNode.appendChild(label);
    }

    public getEditValue(property: PropertyItem, target: any): void {
        if (target && property?.name) {
            target[property.name] = this.get_value();
        }
    }

    public setEditValue(source: any, property: PropertyItem): void {
        if (source && property?.name) {
            this.set_value(source[property.name]);
        }
    }

    get_value(): string {
        if (!this.domNode) return '';
        let val: number[] = [];
        let inputs = this.domNode.querySelectorAll('input:checked');
        inputs.forEach(e => {
            let v = parseInt((e as HTMLInputElement).value, 10);
            if (!isNaN(v)) val.push(v);
        });
        return val.join(',');
    }

    get value(): string {
        return this.get_value();
    }

    set_value(value: string): void {
        if (!this.domNode) return;
        this.pendingValue = value;
        if (value !== this.get_value()) {
            let values: number[] = [];
            if (value) {
                values = value.split(',').map(p => Number(p)).filter(n => !isNaN(n));
            }
            
            let inputs = this.domNode.querySelectorAll('input');
            inputs.forEach(e => {
                (e as HTMLInputElement).checked = false;
            });
            
            if (Array.isArray(values)) {
                values.forEach(v => {
                    let check = this.domNode.querySelector(`input[value='${v}']`) as HTMLInputElement;
                    if (check) {
                        check.checked = true;
                    }
                });
            }
        }
    }

    set value(v: string) {
        this.set_value(v);
    }

    get_readOnly(): boolean {
        return !!this.domNode?.hasAttribute('disabled');
    }

    set_readOnly(value: boolean): void {
        if (!this.domNode) return;
        if (this.get_readOnly() !== value) {
            if (value) {
                this.domNode.setAttribute('disabled', 'disabled');
                let inputs = this.domNode.querySelectorAll('input');
                inputs.forEach(e => e.setAttribute('disabled', 'disabled'));
            } else {
                this.domNode.removeAttribute('disabled');
                let inputs = this.domNode.querySelectorAll('input');
                inputs.forEach(e => e.removeAttribute('disabled'));
            }
        }
    }
}
