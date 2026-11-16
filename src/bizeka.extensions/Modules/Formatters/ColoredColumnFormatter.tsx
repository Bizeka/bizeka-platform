import { Formatter, IInitializeColumn, formatterTypeInfo, registerType } from "@serenity-is/corelib";
import { Column, FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

/** Dark or white text for a hex background, so a pale color stays readable in dark mode too. */
function readableTextColor(background: string): string | undefined {
    const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background.trim());
    if (!match) return undefined;
    const hex = match[1].length === 3 ? match[1].replace(/./g, "$&$&") : match[1];
    const [r, g, b] = [0, 2, 4].map(i => {
        const channel = parseInt(hex.substring(i, i + 2), 16) / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18 ? "#1f2937" : "#ffffff";
}

export class ColoredColumnFormatter implements Formatter, IInitializeColumn {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.ColoredColumnFormatter"); static { registerType(this); }

    constructor(public readonly props: { hideText?: boolean, backgroundProperty?: string, backgroundColor?: string, borderProperty?: string, borderColor?: string } = {}) {
        this.props ??= {};
    }

    format(ctx: FormatterContext): FormatterResult {
        if (!ctx || ctx.value == null) {
            return "";
        }

        let backgroundColor = this.props?.backgroundColor;
        if (!backgroundColor && this.props?.backgroundProperty && ctx.item) {
            backgroundColor = ctx.item[this.props.backgroundProperty];
        }

        let borderColor = this.props?.borderColor;
        if (!borderColor && this.props?.borderProperty && ctx.item) {
            borderColor = ctx.item[this.props.borderProperty];
        }

        let style: any = { height: "100%", width: "100%", maxWidth: "100%", whiteSpace: "pre" };
        if (backgroundColor) {
            style.backgroundColor = backgroundColor;
            const textColor = readableTextColor(backgroundColor);
            if (textColor)
                style.color = textColor;
        }
        if (borderColor) {
            style.border = "1px solid";
            style.borderColor = borderColor;
        }

        return (
            <div style={style}>
                {!this.props?.hideText ? (ctx.value ?? "") : ""}
            </div>
        );
    }

    initializeColumn(column: Column) {
        if (!column) return;
        column.referencedFields = column.referencedFields || [];

        if (this.props?.backgroundProperty && !column.referencedFields.includes(this.props.backgroundProperty))
            column.referencedFields.push(this.props.backgroundProperty);

        if (this.props?.borderProperty && !column.referencedFields.includes(this.props.borderProperty))
            column.referencedFields.push(this.props.borderProperty);
    }

    get hideText() { return this.props?.hideText; }
    set hideText(value) { if (this.props) this.props.hideText = value; }

    get backgroundProperty() { return this.props?.backgroundProperty; }
    set backgroundProperty(value) { if (this.props) this.props.backgroundProperty = value; }

    get backgroundColor() { return this.props?.backgroundColor; }
    set backgroundColor(value) { if (this.props) this.props.backgroundColor = value; }

    get borderProperty() { return this.props?.borderProperty; }
    set borderProperty(value) { if (this.props) this.props.borderProperty = value; }

    get borderColor() { return this.props?.borderColor; }
    set borderColor(value) { if (this.props) this.props.borderColor = value; }
}
