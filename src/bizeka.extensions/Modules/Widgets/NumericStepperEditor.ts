import { Widget, WidgetProps, PropertyItem, IGetEditValue, ISetEditValue, IReadOnly, localText } from "@serenity-is/corelib";

export interface NumericStepperOptions {
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
}

/**
 * The caption's "for" points at the editor's wrapper, so a screen reader does not reach the input through it.
 */
function nameFromFieldCaption(input: HTMLInputElement, editor: HTMLElement) {
    const caption = editor.closest(".field")?.querySelector(".caption")?.textContent?.trim();
    if (caption)
        input.setAttribute("aria-label", caption);
}

/**
 * Reusable Serenity numeric stepper editor with decrement/increment controls.
 * Supports token fallback cascade: host tokens, Bizeka theme tokens, then standard fallback values.
 */
export class NumericStepperEditor extends Widget<NumericStepperOptions> implements IGetEditValue, ISetEditValue, IReadOnly {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.NumericStepperEditor");

    private _input: HTMLInputElement;
    private _btnDec: HTMLButtonElement;
    private _btnInc: HTMLButtonElement;
    private _readOnly = false;

    constructor(props: WidgetProps<NumericStepperOptions>) {
        super(props);

        this.ensureStyles();

        this.domNode.classList.add("bzk-numeric-stepper");

        this._btnDec = document.createElement("button");
        this._btnDec.type = "button";
        this._btnDec.className = "bzk-stepper-btn bzk-stepper-dec";
        this._btnDec.textContent = "-";
        this._btnDec.setAttribute("aria-label", localText("Site.Extensions.Decrease", "Decrease"));

        this._input = document.createElement("input");
        this._input.type = "number";
        this._input.className = "editor s-IntegerEditor bzk-stepper-input";
        nameFromFieldCaption(this._input, this.domNode);
        if (this.options.min != null)
            this._input.min = String(this.options.min);
        if (this.options.max != null)
            this._input.max = String(this.options.max);
        if (this.options.step != null)
            this._input.step = String(this.options.step);

        const initialVal = this.options.defaultValue != null ? this.options.defaultValue : (this.options.min != null ? this.options.min : 0);
        this._input.value = String(initialVal);

        this._btnInc = document.createElement("button");
        this._btnInc.type = "button";
        this._btnInc.className = "bzk-stepper-btn bzk-stepper-inc";
        this._btnInc.textContent = "+";
        this._btnInc.setAttribute("aria-label", localText("Site.Extensions.Increase", "Increase"));

        this.domNode.appendChild(this._btnDec);
        this.domNode.appendChild(this._input);
        this.domNode.appendChild(this._btnInc);

        const step = this.options.step || 1;

        this._btnDec.addEventListener("click", () => {
            if (this._readOnly) return;
            const cur = this.value;
            const next = cur - step;
            if (this.options.min == null || next >= this.options.min) {
                this.value = next;
                this.triggerChange();
            }
        });

        this._btnInc.addEventListener("click", () => {
            if (this._readOnly) return;
            const cur = this.value;
            const next = cur + step;
            if (this.options.max == null || next <= this.options.max) {
                this.value = next;
                this.triggerChange();
            }
        });

        this._input.addEventListener("input", () => {
            this.triggerChange();
        });

        this._input.addEventListener("change", () => {
            this.clampValue();
            this.triggerChange();
        });
    }

    private ensureStyles(): void {
        const styleId = "bzk-numeric-stepper-css";
        if (document.getElementById(styleId))
            return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .bzk-numeric-stepper {
                display: inline-flex;
                align-items: stretch;
                max-width: 240px;
                width: 100%;
                border-radius: var(--bzk-radius-base, var(--bs-border-radius, 0.375rem));
            }
            .bzk-stepper-input {
                flex: 1 1 auto;
                min-width: 60px;
                text-align: center;
                border-radius: 0;
                background-color: var(--bzk-surface-card, var(--bizeka-surface, #ffffff));
                color: var(--bzk-mat-on-surface, var(--bizeka-text, #212529));
                border: 1px solid var(--bzk-border-default, var(--bizeka-border-strong, #dee2e6));
                border-left: none;
                border-right: none;
                padding: 0.375rem 0.5rem;
                font-family: var(--bzk-font-mono, var(--bs-font-monospace, monospace));
                font-size: var(--bzk-font-size-base, var(--bs-body-font-size, 0.875rem));
                line-height: 1.5;
                -moz-appearance: textfield;
            }
            .bzk-stepper-input::-webkit-outer-spin-button,
            .bzk-stepper-input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            .bzk-stepper-input:focus {
                outline: none;
                border-color: var(--bzk-pri, var(--bizeka-accent, #0d6efd));
                z-index: 2;
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, #0d6efd)) 25%, transparent);
            }
            .bzk-stepper-btn {
                flex: 0 0 40px;
                width: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--bzk-surface-toolbar, var(--bizeka-surface-raised, #f8f9fa));
                color: var(--bzk-mat-on-surface, var(--bizeka-text, #212529));
                border: 1px solid var(--bzk-border-default, var(--bizeka-border-strong, #dee2e6));
                font-weight: 600;
                font-size: 1.125rem;
                line-height: 1;
                cursor: pointer;
                user-select: none;
                transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
            }
            .bzk-stepper-dec {
                border-radius: var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) 0 0 var(--bzk-radius-base, var(--bs-border-radius, 0.375rem));
            }
            .bzk-stepper-inc {
                border-radius: 0 var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) 0;
            }
            .bzk-stepper-btn:hover:not(:disabled) {
                background-color: color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, #0d6efd)) 15%, var(--bzk-surface-card, var(--bizeka-surface, #ffffff)));
                color: var(--bzk-pri, var(--bizeka-accent, #0d6efd));
                border-color: var(--bzk-pri, var(--bizeka-accent, #0d6efd));
                z-index: 1;
            }
            .bzk-stepper-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `;
        document.head?.appendChild(style);
    }

    private clampValue(): void {
        let val = Number(this._input.value);
        if (isNaN(val))
            val = this.options.min ?? 0;
        if (this.options.min != null && val < this.options.min)
            val = this.options.min;
        if (this.options.max != null && val > this.options.max)
            val = this.options.max;
        this._input.value = String(val);
    }

    private triggerChange(): void {
        const ev = new CustomEvent("change", { bubbles: true });
        this.domNode.dispatchEvent(ev);
    }

    public get value(): number {
        return Number(this._input.value) || 0;
    }

    public set value(val: number | string | null | undefined) {
        const num = val == null ? (this.options.min ?? 0) : (Number(val) || 0);
        this._input.value = String(num);
        this.clampValue();
    }

    public setEditValue(source: any, property: PropertyItem): void {
        if (source && property?.name) {
            this.value = source[property.name];
        }
    }

    public getEditValue(property: PropertyItem, target: any): void {
        if (target && property?.name) {
            target[property.name] = this.value;
        }
    }

    get_readOnly(): boolean {
        return this._readOnly;
    }

    set_readOnly(value: boolean): void {
        this._readOnly = value;
        this._input.disabled = value;
        this._btnDec.disabled = value;
        this._btnInc.disabled = value;
    }
}
