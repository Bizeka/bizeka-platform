import { Formatter, IInitializeColumn, formatterTypeInfo, registerType } from "@serenity-is/corelib";
import { Column, FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export class FontColorColumnFormatter implements Formatter, IInitializeColumn {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.FontColorColumnFormatter"); static { registerType(this); }

    // Option names match FontColorColumnFormatterAttribute (ColorProperty, Color).
    constructor(public readonly props: { colorProperty?: string, color?: string } = {}) {
        this.props ??= {};
    }

    format(ctx: FormatterContext): FormatterResult {
        if (!ctx || ctx.value == null) {
            return "";
        }

        let color = this.props?.color;
        if (!color && this.props?.colorProperty && ctx.item) {
            color = ctx.item[this.props.colorProperty];
        }

        let style: any = { height: "100%", width: "100%", maxWidth: "100%", whiteSpace: "pre" };
        if (color) {
            style.color = color;
        }

        return (
            <div style={style}>
                <span>{ctx.value ?? ""}</span>
            </div>
        );
    }

    initializeColumn(column: Column) {
        if (!column) return;
        column.referencedFields = column.referencedFields || [];

        if (this.props?.colorProperty && !column.referencedFields.includes(this.props.colorProperty)) {
            column.referencedFields.push(this.props.colorProperty);
        }
    }

    get colorProperty() { return this.props?.colorProperty; }
    set colorProperty(value) { if (this.props) this.props.colorProperty = value; }

    get color() { return this.props?.color; }
    set color(value) { if (this.props) this.props.color = value; }
}
