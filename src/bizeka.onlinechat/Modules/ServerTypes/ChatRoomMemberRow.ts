import { fieldsProxy } from "@serenity-is/corelib";

export interface ChatRoomMemberRow {
    Id?: number;
    RoomId?: number;
    UserId?: number;
    Role?: number;
    InsertUserId?: number;
    InsertDate?: string;
    UpdateUserId?: number;
    UpdateDate?: string;
    DeleteUserId?: number;
    DeleteDate?: string;
    IsActive?: number;
}

export abstract class ChatRoomMemberRow {
    static readonly idProperty = 'Id';
    static readonly isActiveProperty = 'IsActive';
    static readonly localTextPrefix = 'OnlineChat.ChatRoomMember';
    static readonly deletePermission = 'OnlineChat:General';
    static readonly insertPermission = 'OnlineChat:General';
    static readonly readPermission = 'OnlineChat:General';
    static readonly undeletePermission = 'OnlineChat:General';
    static readonly updatePermission = 'OnlineChat:General';

    static readonly Fields = fieldsProxy<ChatRoomMemberRow>();
}