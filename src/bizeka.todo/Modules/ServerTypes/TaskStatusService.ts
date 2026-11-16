import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { TaskStatusRow } from "./TaskStatusRow";

export namespace TaskStatusService {
    export const baseUrl = 'Todo/TaskStatus';

    export declare function Create(request: SaveRequest<TaskStatusRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<TaskStatusRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<TaskStatusRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<TaskStatusRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<TaskStatusRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<TaskStatusRow>>;

    export const Methods = {
        Create: "Todo/TaskStatus/Create",
        Update: "Todo/TaskStatus/Update",
        Delete: "Todo/TaskStatus/Delete",
        Retrieve: "Todo/TaskStatus/Retrieve",
        List: "Todo/TaskStatus/List"
    } as const;

    [
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>TaskStatusService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}