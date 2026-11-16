import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, ServiceRequest, serviceRequest } from "@serenity-is/corelib";
import { NextTaskItemSortOrderResponse } from "./NextTaskItemSortOrderResponse";
import { TaskItemRow } from "./TaskItemRow";

export namespace TaskItemService {
    export const baseUrl = 'Todo/TaskItem';

    export declare function NextSortOrder(request: ServiceRequest, onSuccess?: (response: NextTaskItemSortOrderResponse) => void, opt?: ServiceOptions<any>): PromiseLike<NextTaskItemSortOrderResponse>;
    export declare function Create(request: SaveRequest<TaskItemRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<TaskItemRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<TaskItemRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<TaskItemRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<TaskItemRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<TaskItemRow>>;

    export const Methods = {
        NextSortOrder: "Todo/TaskItem/NextSortOrder",
        Create: "Todo/TaskItem/Create",
        Update: "Todo/TaskItem/Update",
        Delete: "Todo/TaskItem/Delete",
        Retrieve: "Todo/TaskItem/Retrieve",
        List: "Todo/TaskItem/List"
    } as const;

    [
        'NextSortOrder',
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>TaskItemService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}