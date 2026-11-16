import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Site {
        export function asKey(): typeof Site;
        export function asTry(): typeof Site;
        namespace Extensions {
            export function asKey(): typeof Extensions;
            export function asTry(): typeof Extensions;
            export const Decrease: string;
            export const DynamicFieldsTab: string;
            export const Filters: string;
            export const GeneralTab: string;
            export const Increase: string;
            export const InvalidRecordJson: string;
            export const NoRecords: string;
            export const PickColor: string;
            export const PresetColors: string;
            export const RecentColors: string;
            export const TagListAdd: string;
            export const TagListPlaceholder: string;
        }
    }
    export declare namespace Validation {
        export function asKey(): typeof Validation;
        export function asTry(): typeof Validation;
        namespace Bizeka {
            export function asKey(): typeof Bizeka;
            export function asTry(): typeof Bizeka;
            export const Phone: string;
            export const PhoneMultiple: string;
        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Site: {
        Extensions: {}
    },
    Validation: {
        Bizeka: {}
    }
}) as any;

export const ExtensionsSiteTexts = Texts.Site.Extensions;
export const ExtensionsValidationTexts = Texts.Validation.Bizeka;