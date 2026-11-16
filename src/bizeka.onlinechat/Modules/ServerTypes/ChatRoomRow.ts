import { fieldsProxy } from "@serenity-is/corelib";

export interface ChatRoomRow {
    Id?: number;
    ContextType?: string;
    ContextId?: number;
    Name?: string;
    RoomType?: number;
    InsertUserId?: number;
    InsertDate?: string;
    UpdateUserId?: number;
    UpdateDate?: string;
    DeleteUserId?: number;
    DeleteDate?: string;
    IsActive?: number;
}

export abstract class ChatRoomRow {
    static readonly idProperty = 'Id';
    static readonly isActiveProperty = 'IsActive';
    static readonly nameProperty = 'Name';
    static readonly localTextPrefix = 'OnlineChat.ChatRoom';
    static readonly deletePermission = 'OnlineChat:General';
    static readonly insertPermission = 'OnlineChat:General';
    static readonly readPermission = 'OnlineChat:General';
    static readonly undeletePermission = 'OnlineChat:General';
    static readonly updatePermission = 'OnlineChat:General';

    static readonly Fields = fieldsProxy<ChatRoomRow>();
}