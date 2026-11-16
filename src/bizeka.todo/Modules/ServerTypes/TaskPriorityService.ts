import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { TaskPriorityRow } from "./TaskPriorityRow";

export namespace TaskPriorityService {
    export const baseUrl = 'Todo/TaskPriority';

    export declare function Create(request: SaveRequest<TaskPriorityRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<TaskPriorityRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<TaskPriorityRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<TaskPriorityRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<TaskPriorityRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<TaskPriorityRow>>;

    export const Methods = {
        Create: "Todo/TaskPriority/Create",
        Update: "Todo/TaskPriority/Update",
        Delete: "Todo/TaskPriority/Delete",
        Retrieve: "Todo/TaskPriority/Retrieve",
        List: "Todo/TaskPriority/List"
    } as const;

    [
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>TaskPriorityService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}