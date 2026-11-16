import { DeleteRequest, DeleteResponse, ListRequest, ListResponse, RetrieveRequest, RetrieveResponse, SaveRequest, SaveResponse, ServiceOptions, serviceRequest } from "@serenity-is/corelib";
import { ChatRoomRow } from "./ChatRoomRow";

export namespace ChatRoomService {
    export const baseUrl = 'OnlineChat/ChatRoom';

    export declare function Create(request: SaveRequest<ChatRoomRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Update(request: SaveRequest<ChatRoomRow>, onSuccess?: (response: SaveResponse) => void, opt?: ServiceOptions<any>): PromiseLike<SaveResponse>;
    export declare function Delete(request: DeleteRequest, onSuccess?: (response: DeleteResponse) => void, opt?: ServiceOptions<any>): PromiseLike<DeleteResponse>;
    export declare function Retrieve(request: RetrieveRequest, onSuccess?: (response: RetrieveResponse<ChatRoomRow>) => void, opt?: ServiceOptions<any>): PromiseLike<RetrieveResponse<ChatRoomRow>>;
    export declare function List(request: ListRequest, onSuccess?: (response: ListResponse<ChatRoomRow>) => void, opt?: ServiceOptions<any>): PromiseLike<ListResponse<ChatRoomRow>>;

    export const Methods = {
        Create: "OnlineChat/ChatRoom/Create",
        Update: "OnlineChat/ChatRoom/Update",
        Delete: "OnlineChat/ChatRoom/Delete",
        Retrieve: "OnlineChat/ChatRoom/Retrieve",
        List: "OnlineChat/ChatRoom/List"
    } as const;

    [
        'Create',
        'Update',
        'Delete',
        'Retrieve',
        'List'
    ].forEach(x => {
        (<any>ChatRoomService)[x] = function (r, s, o) {
            return serviceRequest(baseUrl + '/' + x, r, s, o);
        };
    });
}