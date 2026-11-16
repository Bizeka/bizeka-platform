import { formatterTypeInfo, Formatter, registerType } from "@serenity-is/corelib";
import { PhoneEditor } from "../Widgets/PhoneEditor";

export class PhoneFormatter implements Formatter {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.PhoneFormatter");
    static { registerType(this); }

    format(ctx: any) {
        if (!ctx.value) return "";
        return PhoneEditor.formatPhone(ctx.value);
    }
}
