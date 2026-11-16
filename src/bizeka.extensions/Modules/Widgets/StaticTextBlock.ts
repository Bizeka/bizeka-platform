import { ISetEditValue, PropertyItem, Widget, WidgetProps, localText, sanitizeHtml, formatDate } from "@serenity-is/corelib";

export interface StaticTextBlockOptions {
    text?: string;
    isHtml?: boolean;
    isLocalText?: boolean;
    hideLabel?: boolean;
    isDate?: boolean;
    isDateTime?: boolean;
}

export class StaticTextBlock<P extends StaticTextBlockOptions = StaticTextBlockOptions> extends Widget<P> implements ISetEditValue {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.StaticTextBlock", [ISetEditValue]);

    static override createDefaultElement() { return document.createElement("div"); }

    declare private value: string;

    constructor(props: WidgetProps<P>) {
        super(props);

        if (this.options?.hideLabel && this.domNode) {
            let label = this.domNode.closest('.field')?.querySelector('.caption') as HTMLLabelElement;
            label && (label.hidden = true);
        }

        if (this.domNode) {
            let req = this.domNode.closest('.field')?.querySelector('sup') as HTMLElement;
            req && (req.hidden = true);
        }

        this.updateElementContent();
    }

    private updateElementContent() {
        if (!this.domNode) return;
        let txt = this.options?.text ?? this.value;

        if (this.options?.isDate && txt) {
            txt = formatDate(txt);
        }

        if (this.options?.isDateTime && txt) {
            txt = formatDate(txt, 'dd/MM/yyyy HH:mm:ss');
        }

        if (this.options?.isLocalText && txt)
            txt = localText(txt);

        if (this.options?.isHtml)
            this.domNode.innerHTML = sanitizeHtml(txt || "");
        else
            this.domNode.textContent = txt || "";
    }

    public setEditValue(source: any, property: PropertyItem) {
        if (this.options?.text == null && source && property?.name) {
            this.value = this.options?.text ?? source[property.name];
            this.updateElementContent();
        }
    }
}
