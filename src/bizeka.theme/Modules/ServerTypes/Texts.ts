import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Site {
        export function asKey(): typeof Site;
        export function asTry(): typeof Site;
        namespace Theme {
            export function asKey(): typeof Theme;
            export function asTry(): typeof Theme;
            export const Dark: string;
            export const Light: string;
            export const Settings: string;
            export const System: string;
        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Site: {
        Theme: {}
    }
}) as any;

export const ThemeTexts = Texts.Site.Theme;