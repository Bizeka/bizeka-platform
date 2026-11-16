import { fieldsProxy } from "@serenity-is/corelib";

export interface ChatMessageRow {
    Id?: number;
    RoomId?: number;
    SenderId?: number;
    SenderName?: string;
    SenderUserImage?: string;
    MessageText?: string;
    FileUrl?: string;
    ReplyToMessageId?: number;
    IsForwarded?: boolean;
    SendDate?: string;
    InsertUserId?: number;
    InsertDate?: string;
    UpdateUserId?: number;
    UpdateDate?: string;
    DeleteUserId?: number;
    DeleteDate?: string;
    IsActive?: number;
}

export abstract class ChatMessageRow {
    static readonly idProperty = 'Id';
    static readonly isActiveProperty = 'IsActive';
    static readonly nameProperty = 'MessageText';
    static readonly localTextPrefix = 'OnlineChat.ChatMessage';
    static readonly deletePermission = 'OnlineChat:General';
    static readonly insertPermission = 'OnlineChat:General';
    static readonly readPermission = 'OnlineChat:General';
    static readonly undeletePermission = 'OnlineChat:General';
    static readonly updatePermission = 'OnlineChat:General';

    static readonly Fields = fieldsProxy<ChatMessageRow>();
}