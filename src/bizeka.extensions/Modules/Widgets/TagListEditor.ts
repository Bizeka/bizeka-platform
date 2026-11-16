import { Widget, WidgetProps, PropertyItem, IGetEditValue, ISetEditValue, IReadOnly, localText } from "@serenity-is/corelib";

export interface TagListEditorOptions {
    placeholder?: string;
    addText?: string;
    removeText?: string;
    delimiter?: string;
    allowDuplicates?: boolean;
}

/**
 * Reusable Serenity tag/chip list editor for string array values.
 * Styles fall back from host theme tokens (`--bzk-*`) to Serenity and Bootstrap 5 variables.
 */
export class TagListEditor extends Widget<TagListEditorOptions> implements IGetEditValue, ISetEditValue, IReadOnly {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.TagListEditor");

    private _tags: string[] = [];
    private _input: HTMLInputElement;
    private _btnAdd: HTMLButtonElement;
    private _badgesContainer: HTMLDivElement;
    private _readOnly = false;

    constructor(props: WidgetProps<TagListEditorOptions>) {
        super(props);

        this.ensureStyles();

        this.domNode.classList.add("bzk-tag-list-wrapper");

        const group = document.createElement("div");
        group.className = "bzk-tag-list-group";

        this._input = document.createElement("input");
        this._input.type = "text";
        this._input.className = "editor s-StringEditor bzk-tag-list-input";
        this._input.placeholder = this.options.placeholder || localText("Site.Extensions.TagListPlaceholder", "Type a value and press Enter");

        this._btnAdd = document.createElement("button");
        this._btnAdd.type = "button";
        this._btnAdd.className = "btn bzk-tag-list-add-btn";
        this._btnAdd.textContent = this.options.addText || localText("Site.Extensions.TagListAdd", "Add");

        group.appendChild(this._input);
        group.appendChild(this._btnAdd);

        this._badgesContainer = document.createElement("div");
        this._badgesContainer.className = "bzk-tag-list-badges";

        this.domNode.appendChild(group);
        this.domNode.appendChild(this._badgesContainer);

        this._btnAdd.addEventListener("click", () => this.addCurrentInput());
        this._input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                this.addCurrentInput();
            }
        });

        this.renderBadges();
    }

    private ensureStyles(): void {
        const styleId = "bzk-tag-list-editor-css";
        if (document.getElementById(styleId))
            return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .bzk-tag-list-wrapper {
                display: flex;
                flex-direction: column;
                gap: 6px;
                width: 100%;
            }
            .bzk-tag-list-group {
                display: flex;
                align-items: stretch;
                max-width: 460px;
                width: 100%;
            }
            .bzk-tag-list-input {
                flex: 1 1 auto;
                min-width: 0;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                background-color: var(--bzk-surface-card, var(--s-input-bg, var(--bs-body-bg, #ffffff)));
                color: var(--bzk-mat-on-surface, var(--s-input-color, var(--bs-body-color, #212529)));
                border: 1px solid var(--bzk-border-default, var(--s-border, var(--bs-border-color, #dee2e6)));
                border-radius: var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) 0 0 var(--bzk-radius-base, var(--bs-border-radius, 0.375rem));
                padding: 0.375rem 0.75rem;
                font-size: var(--bzk-font-size-base, var(--bs-body-font-size, 0.875rem));
                line-height: 1.5;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            .bzk-tag-list-input:focus {
                outline: none;
                border-color: var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd))));
                box-shadow: 0 0 0 2px color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd)))) 25%, transparent);
            }
            .bzk-tag-list-add-btn {
                flex: 0 0 auto;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border-radius: 0 var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) var(--bzk-radius-base, var(--bs-border-radius, 0.375rem)) 0;
                background-color: var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd))));
                border: 1px solid var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd))));
                color: #ffffff;
                font-weight: 500;
                padding: 0.375rem 1rem;
                cursor: pointer;
                transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
            }
            .bzk-tag-list-add-btn:hover:not(:disabled) {
                background-color: var(--bzk-pri-strong, var(--bs-primary, #0b5ed7));
                border-color: var(--bzk-pri-strong, var(--bs-primary, #0b5ed7));
                color: #ffffff;
            }
            .bzk-tag-list-add-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .bzk-tag-list-badges {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                min-height: 28px;
                align-items: center;
            }
            .bzk-tag-chip {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 3px 10px;
                font-size: 0.8125rem;
                font-weight: 500;
                line-height: 1.4;
                border-radius: var(--bzk-radius-pill, var(--bs-border-radius-pill, 50rem));
                background-color: color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd)))) 12%, var(--bzk-surface-card, var(--s-dialog-bg, var(--bs-body-bg, #ffffff))));
                color: var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd))));
                border: 1px solid color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd)))) 28%, var(--bzk-border-default, var(--bs-border-color, #dee2e6)));
                cursor: pointer;
                user-select: none;
                transition: transform 0.1s ease, background-color 0.15s ease, border-color 0.15s ease;
            }
            .bzk-tag-chip:hover {
                background-color: color-mix(in srgb, var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd)))) 20%, var(--bzk-surface-card, var(--s-dialog-bg, var(--bs-body-bg, #ffffff))));
                border-color: var(--bzk-pri, var(--bizeka-accent, var(--s-primary, var(--bs-primary, #0d6efd))));
                transform: translateY(-1px);
            }
            .bzk-tag-chip-remove {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 15px;
                height: 15px;
                line-height: 1;
                border-radius: 50%;
                background: transparent;
                border: none;
                color: inherit;
                opacity: 0.65;
                cursor: pointer;
                padding: 0;
                font-size: 13px;
                transition: opacity 0.15s ease, background-color 0.15s ease;
            }
            .bzk-tag-chip-remove:hover {
                opacity: 1;
                background-color: color-mix(in srgb, var(--bzk-danger, #ef4444) 18%, transparent);
                color: var(--bzk-danger, #ef4444);
            }
        `;
        document.head?.appendChild(style);
    }

    private addCurrentInput(): void {
        if (this._readOnly)
            return;

        const raw = (this._input.value || "").trim().replace(/^\./, "");
        if (!raw)
            return;

        const delimiter = this.options.delimiter || ",";
        const items = raw.split(delimiter).map(x => x.trim().toLowerCase()).filter(Boolean);

        let changed = false;
        for (const item of items) {
            if (this.options.allowDuplicates || !this._tags.includes(item)) {
                this._tags.push(item);
                changed = true;
            }
        }

        if (changed) {
            this._input.value = "";
            this.renderBadges();
            this.triggerChange();
        }
    }

    private renderBadges(): void {
        this._badgesContainer.innerHTML = "";
        const removeLabel = this.options.removeText || localText("Text.TagListEditor.Remove", "Remove");

        this._tags.forEach((tag, idx) => {
            const chip = document.createElement("span");
            chip.className = "bzk-tag-chip";
            chip.title = tag;

            const textSpan = document.createElement("span");
            textSpan.className = "bzk-tag-chip-text";
            textSpan.textContent = tag;
            chip.appendChild(textSpan);

            // Clicking chip populates input for easy edit/copy
            chip.addEventListener("click", (e) => {
                if ((e.target as HTMLElement).closest(".bzk-tag-chip-remove"))
                    return;
                if (!this._readOnly) {
                    this._input.value = tag;
                    this._input.focus();
                    this._input.select();
                }
            });

            if (!this._readOnly) {
                const btnRemove = document.createElement("button");
                btnRemove.type = "button";
                btnRemove.className = "bzk-tag-chip-remove";
                btnRemove.setAttribute("aria-label", `${removeLabel}: ${tag}`);
                btnRemove.innerHTML = "&times;";

                btnRemove.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this._tags.splice(idx, 1);
                    this.renderBadges();
                    this.triggerChange();
                });
                chip.appendChild(btnRemove);
            }

            this._badgesContainer.appendChild(chip);
        });
    }

    private triggerChange(): void {
        const ev = new CustomEvent("change", { bubbles: true });
        this.domNode.dispatchEvent(ev);
    }

    public get value(): string[] {
        return [...this._tags];
    }

    public set value(val: string[] | string | null | undefined) {
        if (!val) {
            this._tags = [];
        } else if (Array.isArray(val)) {
            this._tags = [...val];
        } else if (typeof val === "string") {
            try {
                const parsed = JSON.parse(val);
                this._tags = Array.isArray(parsed) ? parsed : [val];
            } catch {
                const delimiter = this.options.delimiter || ",";
                this._tags = val.split(delimiter).map(x => x.trim()).filter(Boolean);
            }
        } else {
            this._tags = [];
        }
        this.renderBadges();
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
        this._btnAdd.disabled = value;
        this.renderBadges();
    }
}
