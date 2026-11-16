import { formatterTypeInfo, localText, registerType } from "@serenity-is/corelib";
import { FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export class YesNoColoredFormatter {
    static [Symbol.typeInfo] = formatterTypeInfo("Bizeka.Extensions.YesNoColoredFormatter"); static { registerType(this); }

    static format(val: any): FormatterResult {
        let valAsBool = Boolean(val);

        if (valAsBool) {
            return <span class="label label-success" style={{ fontSize: "unset", paddingBottom: "0.1em" }}>{localText("Dialogs.YesButton")}</span>;
        } else {
            return <span class="label label-danger" style={{ fontSize: "unset", paddingBottom: "0.1em" }}>{localText("Dialogs.NoButton")}</span>;
        }
    }

    format(ctx: FormatterContext): FormatterResult {
        return YesNoColoredFormatter.format(ctx.value);
    }
}
