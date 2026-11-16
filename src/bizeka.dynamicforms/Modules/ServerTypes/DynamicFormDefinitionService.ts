import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { DynamicFormDefinitionRow } from "./DynamicFormDefinitionRow";

export namespace DynamicFormDefinitionService {
    export const baseUrl = 'DynamicForms/DynamicFormDefinition';

    export declare function Create(request: SaveRequest<DynamicFormDefinitionRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<DynamicFormDefinitionRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<DynamicFormDefinitionRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<DynamicFormDefinitionRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<DynamicFormDefinitionRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<DynamicFormDefinitionRow>>;

    export const Methods = {
        Create: "DynamicForms/DynamicFormDefinition/Create",
        Update: "DynamicForms/DynamicFormDefinition/Update",
        Delete: "DynamicForms/DynamicFormDefinition/Delete",
        Retrieve: "DynamicForms/DynamicFormDefinition/Retrieve",
        List: "DynamicForms/DynamicFormDefinition/List"
    } as const;

    [
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>DynamicFormDefinitionService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}