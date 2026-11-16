import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { DynamicFormDefinitionRow } from "./DynamicFormDefinitionRow";

export interface DynamicFormDefinitionColumns {
    FormKey: Column<DynamicFormDefinitionRow>;
    Description: Column<DynamicFormDefinitionRow>;
    IsActive: Column<DynamicFormDefinitionRow>;
}

export class DynamicFormDefinitionColumns extends ColumnsBase<DynamicFormDefinitionRow> {
    static readonly columnsKey = 'DynamicForms.DynamicFormDefinition';
    static readonly Fields = fieldsProxy<DynamicFormDefinitionColumns>();
}