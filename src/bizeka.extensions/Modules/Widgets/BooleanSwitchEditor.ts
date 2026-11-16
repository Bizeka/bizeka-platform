import { Widget, WidgetProps, PropertyItem, IGetEditValue, ISetEditValue, IReadOnly } from "@serenity-is/corelib";

export interface BooleanSwitchOptions { }

export class BooleanSwitchEditor extends Widget<BooleanSwitchOptions> implements IGetEditValue, ISetEditValue, IReadOnly {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.BooleanSwitchEditor");

    private _input: HTMLInputElement;
    private _slider: HTMLSpanElement;

    constructor(props: WidgetProps<BooleanSwitchOptions>) {
        super(props);

        if (!document.getElementById('bzk-boolean-switch-css')) {
            const style = document.createElement('style');
            style.id = 'bzk-boolean-switch-css';
            style.innerHTML = `
                .bzk-boolean-switch { position: relative; display: inline-block; width: 44px; height: 24px; margin-top: 5px; }
                .bzk-boolean-switch input { opacity: 0; width: 0; height: 0; }
                .bzk-switch-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e5e7eb; transition: .3s; border-radius: 24px; border: 1px solid #d1d5db; }
                .bzk-switch-slider:before { position: absolute; content: ''; height: 18px; width: 18px; left: 2px; top: 0; bottom: 0; margin-block: auto; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                .bzk-boolean-switch input:checked + .bzk-switch-slider { background-color: #10b981; border-color: #10b981; }
                .bzk-boolean-switch input:checked + .bzk-switch-slider:before { transform: translateX(20px); }
                .bzk-boolean-switch input:disabled + .bzk-switch-slider { opacity: 0.6; cursor: not-allowed; }
            `;
            document.head?.appendChild(style);
        }

        this.domNode?.classList.remove('flexify');
        
        const label = document.createElement('label');
        label.className = 'bzk-boolean-switch';

        this._input = document.createElement('input');
        this._input.type = 'checkbox';
        this._input.id = (this.domNode?.id || 'bsw') + '_bsw';
        // The caption's "for" points at the editor's wrapper, so a screen reader does not reach the input through it.
        const caption = this.domNode?.closest('.field')?.querySelector('.caption')?.textContent?.trim();
        if (caption)
            this._input.setAttribute('aria-label', caption);

        this._slider = document.createElement('span');
        this._slider.className = 'bzk-switch-slider';

        label.appendChild(this._input);
        label.appendChild(this._slider);
        this.domNode?.appendChild(label);
    }

    public setEditValue(source: any, property: PropertyItem): void {
        if (source && property?.name && this._input) {
            this._input.checked = !!source[property.name];
        }
    }

    public getEditValue(property: PropertyItem, target: any): void {
        if (target && property?.name && this._input) {
            target[property.name] = this._input.checked;
        }
    }

    get_readOnly(): boolean {
        return !!this._input?.disabled;
    }

    set_readOnly(value: boolean) {
        if (this._input) {
            this._input.disabled = !!value;
        }
    }

    public get value(): boolean {
        return !!this._input?.checked;
    }

    public set value(data: boolean) {
        if (this._input) {
            this._input.checked = !!data;
        }
    }
}
