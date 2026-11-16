import { Formatter } from "@serenity-is/corelib";
import { FormatterContext, FormatterResult } from "@serenity-is/sleekgrid";

export abstract class BizekaColumnFormatter implements Formatter {
    abstract format(ctx: FormatterContext): FormatterResult;
}
