import { proxyTexts } from "@serenity-is/corelib";

namespace texts {
    export declare namespace Db {
        export function asKey(): typeof Db;
        export function asTry(): typeof Db;
        namespace OnlineChat {
            export function asKey(): typeof OnlineChat;
            export function asTry(): typeof OnlineChat;
            namespace ChatMessage {
                export function asKey(): typeof ChatMessage;
                export function asTry(): typeof ChatMessage;
                export const DeleteDate: string;
                export const DeleteUserId: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const FileUrl: string;
                export const Id: string;
                export const InsertDate: string;
                export const InsertUserId: string;
                export const IsActive: string;
                export const IsForwarded: string;
                export const MessageText: string;
                export const ReplyToMessageId: string;
                export const RoomId: string;
                export const SendDate: string;
                export const SenderId: string;
                export const SenderName: string;
                export const SenderUserImage: string;
                export const UpdateDate: string;
                export const UpdateUserId: string;
            }
            namespace ChatRoom {
                export function asKey(): typeof ChatRoom;
                export function asTry(): typeof ChatRoom;
                export const ContextId: string;
                export const ContextType: string;
                export const DeleteDate: string;
                export const DeleteUserId: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const Id: string;
                export const InsertDate: string;
                export const InsertUserId: string;
                export const IsActive: string;
                export const Name: string;
                export const RoomType: string;
                export const UpdateDate: string;
                export const UpdateUserId: string;
            }
            namespace ChatRoomMember {
                export function asKey(): typeof ChatRoomMember;
                export function asTry(): typeof ChatRoomMember;
                export const DeleteDate: string;
                export const DeleteUserId: string;
                export const EntityPlural: string;
                export const EntitySingular: string;
                export const Id: string;
                export const InsertDate: string;
                export const InsertUserId: string;
                export const IsActive: string;
                export const Role: string;
                export const RoomId: string;
                export const UpdateDate: string;
                export const UpdateUserId: string;
                export const UserId: string;
            }
        }
    }
    export declare namespace Site {
        export function asKey(): typeof Site;
        export function asTry(): typeof Site;
        namespace OnlineChat {
            export function asKey(): typeof OnlineChat;
            export function asTry(): typeof OnlineChat;
            export const AttachFile: string;
            export const ChannelStatus: string;
            export const Chats: string;
            export const CloseChat: string;
            export const EmptyDescription: string;
            export const EmptyTitle: string;
            namespace Errors {
                export function asKey(): typeof Errors;
                export function asTry(): typeof Errors;
                export const MessageSendFailed: string;
                export const Unknown: string;
            }
            export const Live: string;
            export const MessagePlaceholder: string;
            export const NoChats: string;
            namespace Notifications {
                export function asKey(): typeof Notifications;
                export function asTry(): typeof Notifications;
                export const NewMessage: string;
                export const RoomConnected: string;
                export const RoomConnectionFailed: string;
                export const UserOffline: string;
                export const UserOnline: string;
            }
            export const OpenChat: string;
            export const PageTitle: string;
            export const SearchPlaceholder: string;
            export const SelectChat: string;
            export const SendMessage: string;
            export const ShowChatList: string;
            export const TeamInbox: string;
            export const You: string;
        }
    }
    export declare namespace Validation {
        export function asKey(): typeof Validation;
        export function asTry(): typeof Validation;
        namespace OnlineChat {
            export function asKey(): typeof OnlineChat;
            export function asTry(): typeof OnlineChat;
            export const AccessDenied: string;
            export const InvalidMessage: string;
            export const TooManyMessages: string;
        }

    }

}

const Texts: typeof texts = proxyTexts({}, '', {
    Db: {
        OnlineChat: {
            ChatMessage: {},
            ChatRoom: {},
            ChatRoomMember: {}
        }
    },
    Site: {
        OnlineChat: {
            Errors: {},
            Notifications: {}
        }
    },
    Validation: {
        OnlineChat: {}
    }
}) as any;

export const ChatValidationTexts = Texts.Validation.OnlineChat;
export const OnlineChatDbTexts = Texts.Db.OnlineChat;
export const OnlinechatSiteTexts = Texts.Site;