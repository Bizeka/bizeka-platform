import { localText, StringEditor } from "@serenity-is/corelib";

const defaultColor = "#64748b";
const hexPattern = /^#[0-9a-f]{6}$/i;

/**
 * Hex color editor: a free color picker (the browser's native one), the hex text
 * box, a preset palette and the user's recent colors, all in one control-height row.
 */
export class ColorHexEditor extends StringEditor {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.ColorHexEditor");
    private readonly presets = ["#0f172a", "#1d4ed8", "#0f766e", "#7c3aed", "#db2777", "#ea580c", "#ca8a04", "#16a34a"];
    private readonly recentStorageKey = "bizeka.colorhexeditor.recent";
    private picker?: HTMLInputElement;
    private recentHost?: HTMLDivElement;

    constructor(props: any) {
        super(props);
        ColorHexEditor.ensureStyles();
        this.domNode.setAttribute("type", "text");
        this.domNode.setAttribute("maxlength", "7");
        this.domNode.setAttribute("pattern", "#[0-9a-fA-F]{6}");
        this.domNode.setAttribute("spellcheck", "false");
        this.domNode.classList.add("bzk-color-hex");
        if (!this.domNode.getAttribute("value"))
            this.domNode.setAttribute("value", defaultColor);
        this.domNode.addEventListener("input", () => this.sync());
        this.domNode.addEventListener("change", () => {
            this.sync();
            if (hexPattern.test(this.value))
                this.persistRecentColor(this.value);
        });
        queueMicrotask(() => this.enhance());
    }

    // Serenity reads and writes editors through `value` (get_value and set_value delegate to it).
    override get value(): string {
        return this.domNode.value?.trim() || defaultColor;
    }

    override set value(value: string) {
        this.domNode.value = value?.trim() || defaultColor;
        this.sync();
    }

    private enhance() {
        if (this.picker || !this.domNode.parentElement)
            return;

        const editor = document.createElement("div");
        editor.className = "bzk-color-editor";
        this.domNode.insertAdjacentElement("beforebegin", editor);

        const picker = document.createElement("input");
        picker.type = "color";
        picker.className = "bzk-color-native";
        picker.title = picker.ariaLabel = localText("Site.Extensions.PickColor", "Pick a color");
        picker.addEventListener("input", () => this.choose(picker.value, false));
        picker.addEventListener("change", () => this.choose(picker.value, true));

        const field = document.createElement("span");
        field.className = "bzk-color-field";
        field.append(picker, this.domNode);

        const palette = document.createElement("div");
        palette.className = "bzk-color-swatches";
        palette.setAttribute("role", "group");
        palette.ariaLabel = localText("Site.Extensions.PresetColors", "Preset colors");
        for (const color of this.presets)
            palette.appendChild(this.createSwatch(color));

        const recent = document.createElement("div");
        recent.className = "bzk-color-swatches bzk-color-recent";
        recent.setAttribute("role", "group");

        editor.append(field, palette, recent);
        this.picker = picker;
        this.recentHost = recent;
        this.renderRecentColors();
        this.sync();
    }

    private choose(color: string, persist: boolean) {
        this.value = color.toLowerCase();
        this.domNode.dispatchEvent(new Event("change", { bubbles: true }));
        if (persist)
            this.persistRecentColor(color);
    }

    private createSwatch(color: string) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "bzk-color-swatch";
        button.dataset.color = color.toLowerCase();
        button.style.setProperty("--bzk-swatch", color);
        button.title = button.ariaLabel = color.toUpperCase();
        button.addEventListener("click", () => this.choose(color, true));
        return button;
    }

    private sync() {
        const value = this.value.toLowerCase();
        const valid = hexPattern.test(value);
        this.domNode.classList.toggle("bzk-color-invalid", !valid);
        if (valid && this.picker && this.picker.value !== value)
            this.picker.value = value;

        this.domNode.parentElement?.parentElement?.querySelectorAll<HTMLButtonElement>(".bzk-color-swatch").forEach(button => {
            button.setAttribute("aria-pressed", button.dataset.color === value ? "true" : "false");
        });
    }

    private persistRecentColor(color: string) {
        try {
            const current = this.getRecentColors().filter(x => x.toUpperCase() !== color.toUpperCase());
            current.unshift(color);
            localStorage.setItem(this.recentStorageKey, JSON.stringify(current.slice(0, 6)));
            this.renderRecentColors();
        } catch {
        }
    }

    private getRecentColors() {
        try {
            const raw = localStorage.getItem(this.recentStorageKey);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed)
                ? parsed.filter((x): x is string => typeof x === "string" && hexPattern.test(x))
                : [];
        } catch {
            return [];
        }
    }

    private renderRecentColors() {
        if (!this.recentHost)
            return;

        const colors = this.getRecentColors().filter(x => !this.presets.includes(x.toLowerCase()));
        this.recentHost.replaceChildren();
        this.recentHost.hidden = colors.length === 0;
        if (colors.length === 0)
            return;

        const label = localText("Site.Extensions.RecentColors");
        this.recentHost.ariaLabel = label;
        const caption = document.createElement("span");
        caption.className = "bzk-color-recent-label";
        caption.textContent = label;
        this.recentHost.appendChild(caption);

        for (const color of colors)
            this.recentHost.appendChild(this.createSwatch(color));

        this.sync();
    }

    private static ensureStyles() {
        const styleId = "bzk-color-editor-css";
        if (document.getElementById(styleId))
            return;

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .bzk-color-editor {
                display: flex;
                flex: 1 1 auto;
                flex-wrap: wrap;
                align-items: center;
                gap: 8px 14px;
                min-width: 0;
            }
            .bzk-color-field {
                display: inline-flex;
                align-items: stretch;
                gap: 6px;
            }
            .field .bzk-color-field .editor.bzk-color-hex {
                flex: 0 0 auto;
                width: 7.5em;
                font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
                text-transform: uppercase;
            }
            .bzk-color-hex.bzk-color-invalid {
                border-color: var(--bs-danger, #dc3545) !important;
            }
            .bzk-color-field > .bzk-color-native {
                flex: 0 0 auto;
                align-self: stretch;
                inline-size: 2.5em;
                block-size: auto;
                padding: 2px;
                border: 1px solid var(--s-input-border, var(--bs-border-color, #ced4da));
                border-radius: var(--bs-border-radius, .375rem);
                background: var(--s-input-bg, var(--bs-body-bg, #fff));
                cursor: pointer;
            }
            .bzk-color-native::-webkit-color-swatch-wrapper { padding: 0; }
            .bzk-color-native::-webkit-color-swatch { border: 0; border-radius: calc(var(--bs-border-radius, .375rem) - 2px); }
            .bzk-color-native::-moz-color-swatch { border: 0; border-radius: calc(var(--bs-border-radius, .375rem) - 2px); }
            .bzk-color-swatches {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 6px;
            }
            .bzk-color-swatch {
                inline-size: 22px;
                block-size: 22px;
                padding: 0;
                border: 1px solid color-mix(in srgb, var(--bzk-swatch) 60%, var(--bs-body-color, #000));
                border-radius: 50%;
                background: var(--bzk-swatch);
                cursor: pointer;
            }
            .bzk-color-swatch:hover { transform: scale(1.1); }
            .bzk-color-swatch[aria-pressed="true"] {
                box-shadow: 0 0 0 2px var(--s-input-bg, var(--bs-body-bg, #fff)), 0 0 0 4px var(--bzk-swatch);
            }
            .bzk-color-swatch:focus-visible {
                outline: 2px solid var(--bs-primary, #0d6efd);
                outline-offset: 3px;
            }
            .bzk-color-recent-label {
                font-size: 12px;
                color: var(--bs-secondary-color, #6c757d);
                margin-right: 2px;
            }
        `;
        document.head?.appendChild(style);
    }
}
