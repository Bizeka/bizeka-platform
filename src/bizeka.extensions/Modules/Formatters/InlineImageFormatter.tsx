import { Formatter, IInitializeColumn, formatterTypeInfo, registerType, resolveUrl } from "@serenity-is/corelib";
import { Column, FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export class InlineImageFormatter implements Formatter, IInitializeColumn {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.InlineImageFormatter"); static { registerType(this); }

    constructor(public readonly props: { fileProperty?: string, thumb?: boolean, defaultImage?: string, maxHeight?: string, maxWidth?: string } = {}) {
        this.props ??= {};
        this.props.maxHeight ??= '144px';
        this.props.maxWidth ??= '100%';
    }

    format(ctx: FormatterContext): FormatterResult {
        if (!ctx) return "";
        let file = (this.props?.fileProperty && ctx.item ? ctx.item[this.props.fileProperty] : ctx.value) as string;

        let href = '';
        let src = '';

        if (!file || !file.length) {
            href = resolveUrl(this.props?.defaultImage || '');
            src = href;
        } else {
            href = resolveUrl("~/upload/" + file);

            if (this.props?.thumb) {
                var parts = file.split('.');
                file = parts.slice(0, parts.length - 1).join('.') + '_t.jpg';
            }

            src = resolveUrl('~/upload/' + file);
        }

        return (
            <a class="inline-image" target='_blank' href={href}>
                <img src={src} style={{ maxHeight: this.props?.maxHeight, maxWidth: this.props?.maxWidth }} />
            </a>
        );
    }

    initializeColumn(column: Column): void {
        if (!column) return;
        if (this.props?.fileProperty) {
            column.referencedFields = column.referencedFields || [];
            if (!column.referencedFields.includes(this.props.fileProperty)) {
                column.referencedFields.push(this.props.fileProperty);
            }
        }
    }

    get fileProperty() { return this.props?.fileProperty; }
    set fileProperty(value) { if (this.props) this.props.fileProperty = value; }

    get thumb() { return this.props?.thumb; }
    set thumb(value) { if (this.props) this.props.thumb = value; }

    get defaultImage() { return this.props?.defaultImage; }
    set defaultImage(value) { if (this.props) this.props.defaultImage = value; }

    get maxHeight() { return this.props?.maxHeight; }
    set maxHeight(value) { if (this.props) this.props.maxHeight = value; }

    get maxWidth() { return this.props?.maxWidth; }
    set maxWidth(value) { if (this.props) this.props.maxWidth = value; }
}
