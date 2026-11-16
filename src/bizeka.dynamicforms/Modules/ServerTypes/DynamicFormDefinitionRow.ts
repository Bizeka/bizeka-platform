import { fieldsProxy, getLookup, getLookupAsync } from "@serenity-is/corelib";

export interface DynamicFormDefinitionRow {
    Id?: number;
    FormKey?: string;
    DefinitionJson?: string;
    Description?: string;
    IsActive?: boolean;
}

export abstract class DynamicFormDefinitionRow {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'FormKey';
    static readonly localTextPrefix = 'DynamicForms.DynamicFormDefinition';
    static readonly lookupKey = 'DynamicForms.DynamicFormDefinition';

    /** [DEPRECATED] use getLookupAsync instead */
    static getLookup() { return getLookup<DynamicFormDefinitionRow>('DynamicForms.DynamicFormDefinition') }
    static async getLookupAsync() { return getLookupAsync<DynamicFormDefinitionRow>('DynamicForms.DynamicFormDefinition') }

    static readonly deletePermission = 'DynamicForms:Manage';
    static readonly insertPermission = 'DynamicForms:Manage';
    static readonly readPermission = 'DynamicForms:General';
    static readonly updatePermission = 'DynamicForms:Manage';

    static readonly Fields = fieldsProxy<DynamicFormDefinitionRow>();
}