import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { ChatMessageRow } from "./ChatMessageRow";

export namespace ChatMessageService {
    export const baseUrl = 'OnlineChat/ChatMessage';

    export declare function Create(request: SaveRequest<ChatMessageRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<ChatMessageRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<ChatMessageRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<ChatMessageRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<ChatMessageRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<ChatMessageRow>>;

    export const Methods = {
        Create: "OnlineChat/ChatMessage/Create",
        Update: "OnlineChat/ChatMessage/Update",
        Delete: "OnlineChat/ChatMessage/Delete",
        Retrieve: "OnlineChat/ChatMessage/Retrieve",
        List: "OnlineChat/ChatMessage/List"
    } as const;

    [
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>ChatMessageService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}