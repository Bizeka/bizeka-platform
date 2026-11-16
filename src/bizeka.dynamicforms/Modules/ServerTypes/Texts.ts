import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Columns {
        export function asKey(): typeof Columns;
        export function asTry(): typeof Columns;
        namespace DynamicForms {
            export function asKey(): typeof DynamicForms;
            export function asTry(): typeof DynamicForms;
            namespace DynamicFormDefinition {
                export function asKey(): typeof DynamicFormDefinition;
                export function asTry(): typeof DynamicFormDefinition;
                export const Description: string;
                export const FormKey: string;
                export const IsActive: string;
            }
        }
    }
    export declare namespace Db {
        export function asKey(): typeof Db;
        export function asTry(): typeof Db;
        namespace DynamicForms {
            export function asKey(): typeof DynamicForms;
            export function asTry(): typeof DynamicForms;
            namespace DynamicFormDefinition {
                export function asKey(): typeof DynamicFormDefinition;
                export function asTry(): typeof DynamicFormDefinition;
                export const DefinitionJson: string;
                export const Description: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const FormKey: string;
                export const Id: string;
                export const IsActive: string;
            }
        }
    }
    export declare namespace Forms {
        export function asKey(): typeof Forms;
        export function asTry(): typeof Forms;
        namespace DynamicForms {
            export function asKey(): typeof DynamicForms;
            export function asTry(): typeof DynamicForms;
            namespace DynamicFormDefinition {
                export function asKey(): typeof DynamicFormDefinition;
                export function asTry(): typeof DynamicFormDefinition;
                export const DefinitionJson: string;
                export const Description: string;
                export const FormKey: string;
                export const IsActive: string;
            }
        }
    }
    export declare namespace Site {
        export function asKey(): typeof Site;
        export function asTry(): typeof Site;
        namespace DynamicForms {
            export function asKey(): typeof DynamicForms;
            export function asTry(): typeof DynamicForms;
            namespace Dialog {
                export function asKey(): typeof Dialog;
                export function asTry(): typeof Dialog;
                export const FormDesign: string;
                export const ReloadPrompt: string;
            }
            namespace Editor {
                export function asKey(): typeof Editor;
                export function asTry(): typeof Editor;
                export const Actions: string;
                export const AddField: string;
                export const Caption: string;
                export const Delete: string;
                export const DeleteConfirm: string;
                export const Key: string;
                export const NoFields: string;
                export const Required: string;
                export const Type: string;
                export const Undefined: string;
            }
            namespace FieldConfig {
                export function asKey(): typeof FieldConfig;
                export function asTry(): typeof FieldConfig;
                export const Cancel: string;
                export const Caption: string;
                export const DecimalDigits: string;
                export const DefaultValue: string;
                export const EditField: string;
                export const FieldName: string;
                export const LookupDisabledPlaceholder: string;
                export const LookupKey: string;
                export const LookupLoaded: string;
                export const LookupNoMatch: string;
                export const LookupPlaceholder: string;
                export const LookupSelected: string;
                export const MaxLength: string;
                export const MaxValue: string;
                export const MinValue: string;
                export const NewField: string;
                export const Placeholder: string;
                export const ReadOnly: string;
                export const Required: string;
                export const Save: string;
                export const Tab: string;
                export const TextRows: string;
                export const Type: string;
                export const ValidationDecimalDigits: string;
                export const ValidationFieldName: string;
                export const ValidationLookupInvalid: string;
                export const ValidationLookupRequired: string;
                export const ValidationNumericRange: string;
                export const ValidationRequired: string;
                export const ValidationTextRows: string;
            }
            export const InvalidDefinitionJson: string;
            namespace Type {
                export function asKey(): typeof Type;
                export function asTry(): typeof Type;
                export const Boolean: string;
                export const Date: string;
                export const DateTime: string;
                export const Decimal: string;
                export const HtmlContent: string;
                export const Integer: string;
                export const Lookup: string;
                export const String: string;
                export const TextArea: string;
            }

        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Columns: {
        DynamicForms: {
            DynamicFormDefinition: {}
        }
    },
    Db: {
        DynamicForms: {
            DynamicFormDefinition: {}
        }
    },
    Forms: {
        DynamicForms: {
            DynamicFormDefinition: {}
        }
    },
    Site: {
        DynamicForms: {
            Dialog: {},
            Editor: {},
            FieldConfig: {},
            Type: {}
        }
    }
}) as any;

export const DynamicFormsColumnsTexts = Texts.Columns.DynamicForms;
export const DynamicFormsDbTexts = Texts.Db.DynamicForms;
export const DynamicFormsFormTexts = Texts.Forms.DynamicForms;
export const DynamicFormsTexts = Texts.Site.DynamicForms;
export const SiteDynamicFormsTexts = Texts.Site.DynamicForms;