import { StringEditor, WidgetProps, trimToNull, localText } from "@serenity-is/corelib";

export interface PhoneEditorOptions {
    multiple?: boolean;
}

export class PhoneEditor extends StringEditor<PhoneEditorOptions> {
    static override [Symbol.typeInfo] = this.registerEditor("Bizeka.Extensions.PhoneEditor");

    constructor(props: WidgetProps<PhoneEditorOptions>) {
        super(props);

        // The rule must return null (not "") when valid; corelib types the callback as returning string.
        this.addValidationRule(this.uniqueName, (() => {
            let value = trimToNull(this.get_value());
            if (value == null) {
                return null;
            }
            return PhoneEditor.validate(value, !!this.options.multiple);
        }) as () => string);

        this.domNode.addEventListener('input', e => {
            if (!e.isTrusted) return;
            let val = this.domNode.value;
            let formatted = this.getFormattedValue();
            if (val !== formatted) {
                let start = (this.domNode as HTMLInputElement).selectionStart;
                this.domNode.value = formatted;
                // very simple cursor reposition logic
                try { (this.domNode as HTMLInputElement).setSelectionRange(start, start); } catch (e) {}
            }
        });

        this.domNode.addEventListener('change', e => {
            if (!e.isTrusted) {
                return;
            }
            this.formatValue();
        });

        this.domNode.addEventListener('blur', e => {
            if (this.domNode.classList.contains('valid')) {
                this.formatValue();
            }
        });
    }

    protected formatValue(): void {
        this.domNode.value = this.getFormattedValue();
    }

    protected getFormattedValue(): string {
        let value = this.domNode.value;
        if (this.options.multiple) {
            return PhoneEditor.formatMulti(value, PhoneEditor.formatPhone);
        }
        return PhoneEditor.formatPhone(value);
    }

    override get_value() {
        return this.getFormattedValue();
    }

    override set_value(value: string) {
        // Loading an entity without the field passes undefined; show an empty box, not "undefined".
        this.domNode.value = value ?? "";
    }

    /** Returns the error message, or null when valid (an empty string would count as an error for custom rules). */
    static validate(phone: string, isMultiple: boolean): string | null {
        let valid = (isMultiple ? PhoneEditor.isValidMulti(phone, PhoneEditor.isValidPhone) : PhoneEditor.isValidPhone(phone));
        if (valid) {
            return null;
        }
        return localText((isMultiple ? 'Validation.Bizeka.PhoneMultiple' : 'Validation.Bizeka.Phone'));
    }

    static isValidPhone(phone: string) {
        if (!phone) {
            return false;
        }
        phone = phone.replaceAll(' ', '').replaceAll('-', '');
        if (phone.length < 10) {
            return false;
        }

        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }

        if (phone.startsWith('(') && phone.charAt(4) === ')') {
            phone = phone.substring(1, 4) + phone.substring(5);
        }

        if (phone.length !== 10) {
            return false;
        }

        if (phone.startsWith('0')) {
            return false;
        }

        for (let i = 0; i < phone.length; i++) {
            let c = phone.charAt(i);
            if (c < '0' || c > '9') {
                return false;
            }
        }

        return true;
    }

    static formatPhone(phone: string) {
        if (!PhoneEditor.isValidPhone(phone)) {
            return phone;
        }
        phone = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '');
        if (phone.startsWith('0')) {
            phone = phone.substring(1);
        }
        phone = '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + '-' + phone.substring(6, 8) + phone.substring(8);
        return phone;
    }

    static formatMulti(phone: string, format: (s: string) => string) {
        let phones = phone.replaceAll(String.fromCharCode(59), String.fromCharCode(44)).split(String.fromCharCode(44));
        let result = '';
        for (let x of phones) {
            let s = trimToNull(x);
            if (s == null) {
                continue;
            }
            if (result.length > 0) {
                result += ', ';
            }
            result += format(s);
        }
        return result;
    }

    static isValidMulti(phone: string, check: (s: string) => boolean) {
        if (!phone) {
            return false;
        }
        let phones = phone.replaceAll(String.fromCharCode(59), String.fromCharCode(44)).split(String.fromCharCode(44));
        let anyValid = false;
        for (let i = 0; i < phones.length; i++) {
            let x = phones[i];
            let s = trimToNull(x);
            if (s == null) {
                continue;
            }
            if (!check(s)) {
                return false;
            }
            anyValid = true;
        }
        if (!anyValid) {
            return false;
        }
        return true;
    }
}

