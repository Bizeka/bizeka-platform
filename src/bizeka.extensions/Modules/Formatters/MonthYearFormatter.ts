import { formatterTypeInfo, parseISODateTime, registerType } from "@serenity-is/corelib";
import { FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export class MonthYearFormatter {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.MonthYearFormatter"); static { registerType(this); }

    /** Formats a `yyyy-MM` (MonthYearEditor) or ISO date value with the current culture's month names. */
    static format(val: string): FormatterResult {
        if (!val)
            return '';

        if (val.length == 7) val += '-01';
        const valDate = parseISODateTime(val);
        // formatDate has English month names only; the page language selects them here.
        return valDate ? valDate.toLocaleDateString(document.documentElement.lang || "en", { month: "short", year: "numeric" }) : '';
    }

    format(ctx: FormatterContext): FormatterResult {
        return MonthYearFormatter.format(ctx.value as string);
    }
}
