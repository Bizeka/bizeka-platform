namespace Bizeka.DynamicForms;

[NestedLocalTexts(Prefix = "Site.DynamicForms.")]
public static class DynamicFormsTexts
{
    public static readonly LocalText InvalidDefinitionJson = "Dynamic form definition for {0} has invalid JSON.";
    [NestedLocalTexts(Prefix = "Editor.")]
    public static class Editor
    {
        public static readonly LocalText AddField = "Add Field";
        public static readonly LocalText Key = "Key";
        public static readonly LocalText Caption = "Caption";
        public static readonly LocalText Type = "Type";
        public static readonly LocalText Required = "Required?";
        public static readonly LocalText Actions = "Actions";
        public static readonly LocalText DeleteConfirm = "Are you sure you want to delete this field?";
        public static readonly LocalText Undefined = "Undefined";
        public static readonly LocalText NoFields = "No dynamic fields defined yet.";
        public static readonly LocalText Delete = "Delete";
    }

    [NestedLocalTexts(Prefix = "FieldConfig.")]
    public static class FieldConfig
    {
        public static readonly LocalText NewField = "New Field";
        public static readonly LocalText EditField = "Edit Field: {0}";
        public static readonly LocalText Save = "Save";
        public static readonly LocalText Cancel = "Cancel";
        public static readonly LocalText FieldName = "Field Name";
        public static readonly LocalText Caption = "Caption";
        public static readonly LocalText Type = "Type";
        public static readonly LocalText LookupKey = "Lookup Key";
        public static readonly LocalText Tab = "Tab";
        public static readonly LocalText MaxLength = "Max Length";
        public static readonly LocalText MinValue = "Min Value";
        public static readonly LocalText MaxValue = "Max Value";
        public static readonly LocalText DecimalDigits = "Decimal Digits";
        public static readonly LocalText TextRows = "Text Rows";
        public static readonly LocalText Placeholder = "Placeholder";
        public static readonly LocalText DefaultValue = "Default Value";
        public static readonly LocalText ReadOnly = "Read Only";
        public static readonly LocalText Required = "Required";
        public static readonly LocalText ValidationRequired = "Field name, caption and type are required.";
        public static readonly LocalText ValidationFieldName = "Field name may only contain letters and numbers, without spaces or special characters.";
        public static readonly LocalText ValidationDecimalDigits = "Decimal digits must be zero or greater.";
        public static readonly LocalText ValidationTextRows = "Text rows must be at least 2.";
        public static readonly LocalText ValidationNumericRange = "Min value can not be greater than max value.";
        public static readonly LocalText ValidationLookupRequired = "Please choose a lookup key for lookup fields.";
        public static readonly LocalText ValidationLookupInvalid = "The selected lookup key was not found in the current system.";
        public static readonly LocalText LookupPlaceholder = "Start typing a lookup key, e.g. Work.WorkType";
        public static readonly LocalText LookupDisabledPlaceholder = "Available only for Lookup type";
        public static readonly LocalText LookupLoaded = "Available lookups are listed below.";
        public static readonly LocalText LookupSelected = "Selected source: {0}";
        public static readonly LocalText LookupNoMatch = "No matching lookup was found in the current system.";
    }

    [NestedLocalTexts(Prefix = "Type.")]
    public static class Type
    {
        public static readonly LocalText String = "String";
        public static readonly LocalText Integer = "Integer";
        public static readonly LocalText Decimal = "Decimal";
        public static readonly LocalText Date = "Date";
        public static readonly LocalText DateTime = "Date Time";
        public static readonly LocalText Boolean = "Boolean";
        public static readonly LocalText Lookup = "Lookup";
        public static readonly LocalText TextArea = "Text Area";
        public static readonly LocalText HtmlContent = "HTML Content";
    }

    [NestedLocalTexts(Prefix = "Dialog.")]
    public static class Dialog
    {
        public static readonly LocalText FormDesign = "Form Design";
        public static readonly LocalText ReloadPrompt = "Form definition changed. Reload the page?";
    }
}

[NestedLocalTexts(Prefix = "Site.DynamicForms.")]
public static class SiteDynamicFormsTexts
{
    [NestedLocalTexts(Prefix = "Editor.")]
    public static class Editor
    {
        public static readonly LocalText AddField = "Add Field";
        public static readonly LocalText Key = "Key";
        public static readonly LocalText Caption = "Caption";
        public static readonly LocalText Type = "Type";
        public static readonly LocalText Required = "Required?";
        public static readonly LocalText Actions = "Actions";
        public static readonly LocalText DeleteConfirm = "Are you sure you want to delete this field?";
        public static readonly LocalText Undefined = "Undefined";
        public static readonly LocalText NoFields = "No dynamic fields defined yet.";
        public static readonly LocalText Delete = "Delete";
    }

    [NestedLocalTexts(Prefix = "FieldConfig.")]
    public static class FieldConfig
    {
        public static readonly LocalText NewField = "New Field";
        public static readonly LocalText EditField = "Edit Field: {0}";
        public static readonly LocalText Save = "Save";
        public static readonly LocalText Cancel = "Cancel";
        public static readonly LocalText FieldName = "Field Name";
        public static readonly LocalText Caption = "Caption";
        public static readonly LocalText Type = "Type";
        public static readonly LocalText LookupKey = "Lookup Key";
        public static readonly LocalText Tab = "Tab";
        public static readonly LocalText MaxLength = "Max Length";
        public static readonly LocalText MinValue = "Min Value";
        public static readonly LocalText MaxValue = "Max Value";
        public static readonly LocalText DecimalDigits = "Decimal Digits";
        public static readonly LocalText TextRows = "Text Rows";
        public static readonly LocalText Placeholder = "Placeholder";
        public static readonly LocalText DefaultValue = "Default Value";
        public static readonly LocalText ReadOnly = "Read Only";
        public static readonly LocalText Required = "Required";
        public static readonly LocalText ValidationRequired = "Field name, caption and type are required.";
        public static readonly LocalText ValidationFieldName = "Field name may only contain letters and numbers, without spaces or special characters.";
        public static readonly LocalText ValidationDecimalDigits = "Decimal digits must be zero or greater.";
        public static readonly LocalText ValidationTextRows = "Text rows must be at least 2.";
        public static readonly LocalText ValidationNumericRange = "Min value can not be greater than max value.";
        public static readonly LocalText ValidationLookupRequired = "Please choose a lookup key for lookup fields.";
        public static readonly LocalText ValidationLookupInvalid = "The selected lookup key was not found in the current system.";
        public static readonly LocalText LookupPlaceholder = "Start typing a lookup key, e.g. Work.WorkType";
        public static readonly LocalText LookupDisabledPlaceholder = "Available only for Lookup type";
        public static readonly LocalText LookupLoaded = "Available lookups are listed below.";
        public static readonly LocalText LookupSelected = "Selected source: {0}";
        public static readonly LocalText LookupNoMatch = "No matching lookup was found in the current system.";
    }

    [NestedLocalTexts(Prefix = "Type.")]
    public static class Type
    {
        public static readonly LocalText String = "String";
        public static readonly LocalText Integer = "Integer";
        public static readonly LocalText Decimal = "Decimal";
        public static readonly LocalText Date = "Date";
        public static readonly LocalText DateTime = "Date Time";
        public static readonly LocalText Boolean = "Boolean";
        public static readonly LocalText Lookup = "Lookup";
        public static readonly LocalText TextArea = "Text Area";
        public static readonly LocalText HtmlContent = "HTML Content";
    }

    [NestedLocalTexts(Prefix = "Dialog.")]
    public static class Dialog
    {
        public static readonly LocalText FormDesign = "Form Design";
        public static readonly LocalText ReloadPrompt = "Form definition changed. Reload the page?";
    }
}
