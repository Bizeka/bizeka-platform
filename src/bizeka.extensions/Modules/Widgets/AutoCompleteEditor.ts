import { StringEditor, getLookupAsync, WidgetProps } from "@serenity-is/corelib";

export interface AutoCompleteOptions {
    lookupKey?: string;
    sourceArray?: string[];
    sourceCSV?: string;
    minSearchLength?: number;
}

const styleId = "bizeka-autocomplete-style";

// Styled with the theme tokens. The browser's native datalist popup cannot be styled, so this list replaces it.
const css = `
.bzk-autocomplete-list {
    position: fixed;
    z-index: 1080;
    margin: 0;
    padding: 4px;
    list-style: none;
    max-height: 240px;
    overflow-y: auto;
    border: 1px solid var(--bizeka-border, var(--bs-border-color));
    border-radius: var(--bizeka-radius-md, 0.5rem);
    background: var(--bizeka-surface, var(--bs-body-bg));
    color: var(--bizeka-text, var(--bs-body-color));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    font-size: 0.875rem;
    scrollbar-width: thin;
}
.bzk-autocomplete-option {
    padding: 6px 10px;
    border-radius: var(--bizeka-radius-sm, 0.25rem);
    cursor: pointer;
}
.bzk-autocomplete-option[aria-selected="true"] {
    background: var(--bizeka-accent-soft, var(--bs-primary-bg-subtle, #eef0fd));
    color: var(--bizeka-accent, var(--bs-primary));
}
`;

export class AutoCompleteEditor extends StringEditor<AutoCompleteOptions> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.AutoCompleteEditor");

    private suggestions: string[] = [];
    private popup: HTMLUListElement | undefined;
    private activeIndex = -1;

    constructor(props: WidgetProps<AutoCompleteOptions>) {
        super(props);

        const input = this.domNode as HTMLInputElement;
        if (!input) return;

        input.addEventListener('change', e => {
            if (!e || !e.isTrusted) {
                return;
            }
        });

        setTimeout(() => {
            if (this.domNode) {
                this.bindAutoComplete(input);
            }
        }, 100);
    }

    protected async bindAutoComplete(input: HTMLInputElement): Promise<void> {
        if (!input) return;
        let opt = this.options || {};
        let source: string[] = opt.sourceArray || [];

        if (opt.sourceCSV) {
            source = opt.sourceCSV.split(',');
        }
        else if (opt.lookupKey) {
            try {
                const lookup = await getLookupAsync<any>(opt.lookupKey);
                if (lookup?.items) {
                    source = lookup.items.map((m: any) => m ? m[lookup.textField] : null).filter(Boolean);
                }
            }
            catch {
                source = [];
            }
        }

        this.suggestions = source.filter(x => x != null).map(x => String(x));
        this.attachKeyboardAndMouse(input, opt.minSearchLength ?? 0);
    }

    private attachKeyboardAndMouse(input: HTMLInputElement, minSearchLength: number) {
        if (input.dataset.bzkAutocomplete === "1") return;
        input.dataset.bzkAutocomplete = "1";
        input.setAttribute("autocomplete", "off");
        input.setAttribute("role", "combobox");
        input.setAttribute("aria-autocomplete", "list");
        injectStyle();

        input.addEventListener("input", () => this.refresh(input, minSearchLength));
        input.addEventListener("focus", () => this.refresh(input, minSearchLength));
        input.addEventListener("blur", () => setTimeout(() => this.close(input), 150));
        input.addEventListener("keydown", e => this.onKeyDown(e, input));
        window.addEventListener("resize", () => this.close(input));
    }

    private refresh(input: HTMLInputElement, minSearchLength: number) {
        const text = input.value.trim().toLowerCase();
        if (text.length < minSearchLength) return this.close(input);

        const matches = this.suggestions.filter(x => x.toLowerCase().includes(text) && x.toLowerCase() !== text);
        if (!matches.length) return this.close(input);

        this.open(input, matches);
    }

    private open(input: HTMLInputElement, matches: string[]) {
        if (!this.popup) {
            this.popup = document.createElement("ul");
            this.popup.className = "bzk-autocomplete-list";
            this.popup.setAttribute("role", "listbox");
            // mousedown keeps focus in the input, so a click on an option is not lost to the blur handler.
            this.popup.addEventListener("mousedown", e => e.preventDefault());
            document.body.appendChild(this.popup);
        }

        const list = this.popup;
        list.replaceChildren();
        this.activeIndex = -1;
        input.setAttribute("aria-expanded", "true");

        matches.forEach((value, index) => {
            const option = document.createElement("li");
            option.className = "bzk-autocomplete-option";
            option.setAttribute("role", "option");
            option.setAttribute("aria-selected", "false");
            option.id = `${input.id || "bzk-ac"}-opt-${index}`;
            option.textContent = value;
            option.addEventListener("click", () => this.choose(input, value));
            list.appendChild(option);
        });

        const rect = input.getBoundingClientRect();
        list.style.left = `${rect.left}px`;
        list.style.top = `${rect.bottom + 4}px`;
        list.style.width = `${rect.width}px`;
        list.style.display = "block";
    }

    private close(input: HTMLInputElement) {
        if (this.popup) this.popup.style.display = "none";
        input.setAttribute("aria-expanded", "false");
        this.activeIndex = -1;
    }

    private choose(input: HTMLInputElement, value: string) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        this.close(input);
    }

    private onKeyDown(e: KeyboardEvent, input: HTMLInputElement) {
        if (!this.popup || this.popup.style.display !== "block") return;
        const options = Array.from(this.popup.querySelectorAll<HTMLElement>(".bzk-autocomplete-option"));
        if (!options.length) return;

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const step = e.key === "ArrowDown" ? 1 : -1;
            this.activeIndex = (this.activeIndex + step + options.length) % options.length;
            options.forEach((o, i) => o.setAttribute("aria-selected", String(i === this.activeIndex)));
            options[this.activeIndex].scrollIntoView({ block: "nearest" });
            input.setAttribute("aria-activedescendant", options[this.activeIndex].id);
        }
        else if (e.key === "Enter" && this.activeIndex >= 0) {
            e.preventDefault();
            this.choose(input, options[this.activeIndex].textContent ?? "");
        }
        else if (e.key === "Escape") {
            this.close(input);
        }
    }
}

function injectStyle() {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
}
