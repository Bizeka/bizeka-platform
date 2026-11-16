import { Widget, WidgetProps, Authorization, notifySuccess, notifyInfo, notifyWarning, serviceCall, resolveUrl, localText } from "@serenity-is/corelib";
import { ChatConnection } from "./ChatConnection";
import "./ChatPanel.css";

function formatLocalText(key: string, values: Record<string, string | number>): string {
    let value = localText(key);
    for (const [name, replacement] of Object.entries(values))
        value = value.split('{' + name + '}').join(String(replacement));
    return value;
}

export interface NormalizedChatMessage {
    id: number | null;
    roomId: number | null;
    senderId: string | null;
    senderName: string;
    senderUserImage: string | null;
    messageText: string;
    sendDate: Date | null;
    isForwarded: boolean;
    raw?: any;
}

function parseMessageDate(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    try {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    } catch {
        return null;
    }
}

export interface ChatPanelOptions {
    isMiniature?: boolean;
}

export class ChatPanel<P extends ChatPanelOptions = ChatPanelOptions> extends Widget<P> {

    private roomListUl!: HTMLUListElement;
    private noRoomsMessage!: HTMLElement;
    protected messagesArea!: HTMLDivElement;
    protected messageInput!: HTMLInputElement;
    protected currentRoomName!: HTMLElement;
    protected connection: ChatConnection;
    protected activeRoomId: number | null = null;
    protected currentUserId: string | null = null;
    protected currentUserName: string | null = null;
    protected onlineUserIds: Set<number> = new Set();

    constructor(props: WidgetProps<P>) {
        super(props);
        const userDef = Authorization.userDefinition as any;
        this.currentUserId = userDef?.Id?.toString() || userDef?.UserId?.toString() || null;
        this.currentUserName = Authorization.username || userDef?.DisplayName || userDef?.Username || null;
        this.renderUI();

        if (this.options.isMiniature) {
            this.domNode.classList.add("bzk-chat-mini");
        }

        this.connection = new ChatConnection();
        this.connection.onMessageReceived = (msg) => {
            const norm = this.normalizeMessage(msg);
            if (this.activeRoomId === norm.roomId) {
                const isMe = this.isMessageSentByMe(norm);
                this.appendMessage(norm.messageText, isMe, norm);
            } else {
                notifyInfo(formatLocalText("Site.OnlineChat.Notifications.NewMessage", { message: norm.messageText }));
            }
        };

        this.connection.onUserPresence = (userId: number, displayName: string, isOnline: boolean) => {
            if (isOnline) {
                this.onlineUserIds.add(userId);
                notifySuccess(formatLocalText("Site.OnlineChat.Notifications.UserOnline", { user: displayName }));
            } else {
                this.onlineUserIds.delete(userId);
                notifyWarning(formatLocalText("Site.OnlineChat.Notifications.UserOffline", { user: displayName }));
            }
            this.updatePresenceBadges();
        };

        this.connection.start().then(() => {
            this.loadRooms();
        });
    }

    private renderUI() {
        this.domNode.classList.add("bzk-chat-wrapper");

        const sidebar = document.createElement("div");
        sidebar.className = "bzk-chat-sidebar";

        const sidebarHeader = document.createElement("div");
        sidebarHeader.className = "bzk-chat-sidebar-header";
        const sidebarKicker = document.createElement("span");
        sidebarKicker.className = "bzk-chat-sidebar-kicker";
        sidebarKicker.textContent = localText("Site.OnlineChat.TeamInbox") || "Team Inbox";
        const sidebarTitle = document.createElement("strong");
        sidebarTitle.textContent = localText("Site.OnlineChat.Chats") || "Chats";

        const roomsCloseButton = document.createElement("button");
        roomsCloseButton.type = "button";
        roomsCloseButton.className = "bzk-chat-rooms-close";
        roomsCloseButton.title = localText("Site.OnlineChat.CloseChat") || "Close chat";
        roomsCloseButton.setAttribute("aria-label", localText("Site.OnlineChat.CloseChat") || "Close chat");
        const roomsCloseIcon = document.createElement("i");
        roomsCloseIcon.className = "fa fa-times";
        roomsCloseIcon.setAttribute("aria-hidden", "true");
        roomsCloseButton.appendChild(roomsCloseIcon);
        roomsCloseButton.addEventListener("click", () => {
            const modalContainer = this.domNode.closest<HTMLElement>(".bzk-chat-modal-container");
            const modalCloseButton = modalContainer?.querySelector<HTMLButtonElement>(
                ":scope > .bzk-chat-modal-close");
            if (modalCloseButton) {
                modalCloseButton.click();
                return;
            }

            this.domNode.dispatchEvent(new CustomEvent("bzk-chat-close", { bubbles: true }));
        });

        sidebarHeader.append(sidebarKicker, sidebarTitle, roomsCloseButton);

        const searchDiv = document.createElement("div");
        searchDiv.className = "bzk-chat-search form-control";
        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.className = "w-100";
        searchInput.placeholder = localText("Site.OnlineChat.SearchPlaceholder") || "Search...";
        searchInput.setAttribute("aria-label", searchInput.placeholder);
        searchInput.addEventListener("input", () => this.filterRooms(searchInput.value));
        searchDiv.appendChild(searchInput);

        this.roomListUl = document.createElement("ul");
        this.roomListUl.className = "bzk-chat-room-list";

        this.noRoomsMessage = document.createElement("div");
        this.noRoomsMessage.className = "bzk-chat-no-rooms";
        this.noRoomsMessage.setAttribute("role", "status");
        this.noRoomsMessage.textContent = localText("Site.OnlineChat.NoChats") || "No chats found";
        this.noRoomsMessage.hidden = true;

        sidebar.appendChild(sidebarHeader);
        sidebar.appendChild(searchDiv);
        sidebar.appendChild(this.roomListUl);
        sidebar.appendChild(this.noRoomsMessage);

        const mainArea = document.createElement("div");
        mainArea.className = "bzk-chat-main";

        const mainHeader = document.createElement("div");
        mainHeader.className = "bzk-chat-main-header";

        const backBtn = document.createElement("button");
        backBtn.className = "bzk-chat-back-btn";
        backBtn.type = "button";
        backBtn.title = localText("Site.OnlineChat.ShowChatList") || "Back";
        backBtn.setAttribute("aria-label", localText("Site.OnlineChat.ShowChatList") || "Back");
        backBtn.innerHTML = "<i class='fa fa-arrow-left' aria-hidden='true'></i>";
        backBtn.onclick = () => {
            this.domNode.classList.remove("chat-active", "chat-room-selected");
        };

        this.currentRoomName = document.createElement("h5");
        this.currentRoomName.className = "mb-0";
        this.currentRoomName.textContent = localText("Site.OnlineChat.SelectChat") || "Select a chat";

        const channelStatus = document.createElement("span");
        channelStatus.className = "bzk-chat-channel-status";
        const channelLabel = document.createElement("span");
        channelLabel.className = "bzk-chat-channel-status-label";
        channelLabel.textContent = localText("Site.OnlineChat.ChannelStatus") || "Workspace Channel";
        const liveLabel = document.createElement("span");
        liveLabel.className = "bzk-chat-channel-status-live";
        liveLabel.textContent = localText("Site.OnlineChat.Live") || "Live";
        channelStatus.append(channelLabel, liveLabel);

        mainHeader.appendChild(backBtn);
        mainHeader.appendChild(this.currentRoomName);
        mainHeader.appendChild(channelStatus);

        this.messagesArea = document.createElement("div");
        this.messagesArea.className = "bzk-chat-messages-area";
        this.renderEmptyState();

        const inputArea = document.createElement("div");
        inputArea.className = "bzk-chat-input-area";

        const inputWrapper = document.createElement("div");
        inputWrapper.className = "bzk-chat-input-wrapper";

        this.messageInput = document.createElement("input");
        this.messageInput.type = "text";
        this.messageInput.maxLength = 4000; // ChatMessageRow.MaxMessageLength
        this.messageInput.placeholder = localText("Site.OnlineChat.MessagePlaceholder") || "Type a message...";
        this.messageInput.setAttribute("aria-label", this.messageInput.placeholder);
        this.messageInput.addEventListener("keydown", (e) => {
            // keypress is deprecated and some input methods never fire it; Enter that confirms an IME composition does not send.
            if (e.key === "Enter" && !e.isComposing) this.sendMessage();
        });

        inputWrapper.appendChild(this.messageInput);

        const sendBtn = document.createElement("button");
        sendBtn.className = "bzk-chat-btn-primary";
        sendBtn.type = "button";
        sendBtn.title = localText("Site.OnlineChat.SendMessage") || "Send";
        sendBtn.setAttribute("aria-label", localText("Site.OnlineChat.SendMessage") || "Send");
        sendBtn.innerHTML = "<i class='fa fa-paper-plane' aria-hidden='true'></i>";
        sendBtn.addEventListener("click", () => this.sendMessage());

        inputArea.appendChild(inputWrapper);
        inputArea.appendChild(sendBtn);

        mainArea.appendChild(mainHeader);
        mainArea.appendChild(this.messagesArea);
        mainArea.appendChild(inputArea);

        this.domNode.appendChild(sidebar);
        this.domNode.appendChild(mainArea);
    }

    private loadRooms() {
        serviceCall({
            url: resolveUrl("~/Services/OnlineChat/ChatRoom/List"),
            request: {
                Sort: ["Name"]
            },
            onSuccess: (res: any) => {
                this.noRoomsMessage.hidden = res.Entities?.length > 0;
                if (res.Entities && res.Entities.length > 0) {
                    this.roomListUl.replaceChildren();
                    res.Entities.forEach((room: any) => {
                        const li = document.createElement("li");
                        li.className = "bzk-chat-room-item";
                        li.dataset.roomId = String(room.Id);
                        const roomName = String(room.Name || "");
                        const avatar = document.createElement("div");
                        avatar.className = "bzk-chat-room-avatar";
                        avatar.textContent = roomName.charAt(0) || "?";

                        const roomInfo = document.createElement("div");
                        roomInfo.className = "bzk-chat-room-info";
                        const roomTitle = document.createElement("div");
                        roomTitle.className = "bzk-chat-room-name";
                        roomTitle.textContent = roomName;
                        roomInfo.appendChild(roomTitle);

                        const presenceBadge = document.createElement("span");
                        presenceBadge.className = "bzk-presence-badge online";

                        li.append(avatar, roomInfo, presenceBadge);
                        li.setAttribute("role", "button");
                        li.tabIndex = 0;
                        li.addEventListener("keydown", e => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                li.click();
                            }
                        });
                        li.addEventListener("click", () => {
                            if (this.activeRoomId) {
                                this.connection.leaveRoom(this.activeRoomId);
                            }

                            this.domNode.querySelectorAll(".bzk-chat-room-item").forEach(x => x.classList.remove("active"));
                            li.classList.add("active");

                            this.activeRoomId = room.Id;
                            this.currentRoomName.textContent = roomName;
                            this.clearMessages();

                            if (this.options.isMiniature) {
                                this.domNode.classList.add("chat-active");
                            }
                            this.domNode.classList.add("chat-room-selected");

                            this.connection.joinRoom(room.Id)
                                .then(joined => {
                                    if (joined)
                                        notifySuccess(formatLocalText("Site.OnlineChat.Notifications.RoomConnected", { room: roomName }));
                                    else
                                        notifyWarning(localText("Site.OnlineChat.Notifications.RoomConnectionFailed") || "Room connection failed");
                                })
                                .catch(() => notifyWarning(localText("Site.OnlineChat.Notifications.RoomConnectionFailed") || "Room connection failed"));
                            this.loadChatHistory(room.Id);
                        });
                        this.roomListUl.appendChild(li);
                    });
                }
            }
        });
    }

    private filterRooms(text: string) {
        const term = text.trim().toLocaleLowerCase();
        let visible = 0;
        this.roomListUl.querySelectorAll<HTMLElement>(".bzk-chat-room-item").forEach(item => {
            item.hidden = !(item.querySelector(".bzk-chat-room-name")?.textContent ?? "").toLocaleLowerCase().includes(term);
            if (!item.hidden) visible++;
        });
        this.noRoomsMessage.hidden = visible > 0;
    }

    private updatePresenceBadges() {
        // Rooms can update presence indicators based on online users
        const items = this.roomListUl.querySelectorAll<HTMLElement>(".bzk-chat-room-item");
        items.forEach(item => {
            const badge = item.querySelector(".bzk-presence-badge");
            if (badge) {
                // If presence tracking is active
                badge.className = "bzk-presence-badge online";
            }
        });
    }

    public normalizeMessage(raw: any): NormalizedChatMessage {
        if (!raw) {
            return {
                id: null,
                roomId: null,
                senderId: null,
                senderName: "",
                senderUserImage: null,
                messageText: "",
                sendDate: null,
                isForwarded: false
            };
        }

        const id = raw.Id ?? raw.id ?? null;
        const roomId = raw.RoomId ?? raw.roomId ?? null;
        const senderIdRaw = raw.SenderId ?? raw.senderId;
        const senderId = senderIdRaw != null ? String(senderIdRaw) : null;
        const senderName = String(raw.SenderName ?? raw.senderName ?? "").trim();
        const senderUserImage = raw.SenderUserImage ?? raw.senderUserImage ?? null;
        const messageText = String(raw.MessageText ?? raw.messageText ?? "");
        const sendDate = parseMessageDate(raw.SendDate ?? raw.sendDate);
        const isForwarded = Boolean(raw.IsForwarded ?? raw.isForwarded);

        return {
            id,
            roomId,
            senderId,
            senderName,
            senderUserImage,
            messageText,
            sendDate,
            isForwarded,
            raw
        };
    }

    private isMessageSentByMe(norm: NormalizedChatMessage): boolean {
        if (norm.senderId && this.currentUserId && String(norm.senderId) === String(this.currentUserId))
            return true;
        if (norm.senderName && this.currentUserName && norm.senderName.trim().toLowerCase() === this.currentUserName.trim().toLowerCase())
            return true;
        return false;
    }

    private loadChatHistory(roomId: number) {
        serviceCall({
            url: resolveUrl("~/Services/OnlineChat/ChatMessage/List"),
            request: {
                EqualityFilter: { RoomId: roomId },
                Sort: ["SendDate DESC", "Id DESC"]
            },
            onSuccess: (res: any) => {
                if (res.Entities) {
                    this.clearMessages();
                    const msgs = res.Entities.reverse();
                    msgs.forEach((m: any) => {
                        const norm = this.normalizeMessage(m);
                        const isMe = this.isMessageSentByMe(norm);
                        this.appendMessage(norm.messageText, isMe, norm);
                    });
                }
            }
        });
    }

    protected sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text || !this.activeRoomId) return;

        serviceCall({
            url: resolveUrl("~/Services/OnlineChat/ChatMessage/Create"),
            request: {
                Entity: {
                    RoomId: this.activeRoomId,
                    MessageText: text
                }
            },
            onSuccess: () => {
                this.messageInput.value = "";
            },
            onError: (err: any) => {
                notifyWarning(formatLocalText("Site.OnlineChat.Errors.MessageSendFailed", {
                    error: err?.Message || err?.Error?.Message || localText("Site.OnlineChat.Errors.Unknown") || "Send failed"
                }));
            }
        });
    }

    public appendMessage(text: string, isSentByMe: boolean, meta?: any) {
        this.removeEmptyState();

        const norm = this.normalizeMessage(meta);
        const effectiveText = norm.messageText || text || "";

        const row = document.createElement("div");
        row.className = "bzk-chat-message-row " + (isSentByMe ? "outgoing" : "incoming");

        const avatar = document.createElement("div");
        avatar.className = "bzk-chat-msg-avatar";

        const senderName = norm.senderName
            || (isSentByMe ? (this.currentUserName || localText("Site.OnlineChat.You") || "You") : (norm.senderId ? ("User #" + norm.senderId) : "User"));

        if (norm.senderUserImage) {
            const img = document.createElement("img");
            img.src = resolveUrl("~/upload/" + norm.senderUserImage.replace(/^~\/?(upload\/)?/, ""));
            img.alt = senderName;
            img.onerror = () => {
                avatar.textContent = senderName.charAt(0).toUpperCase() || "?";
            };
            avatar.appendChild(img);
        } else {
            avatar.textContent = senderName.charAt(0).toUpperCase() || "?";
        }

        const content = document.createElement("div");
        content.className = "bzk-chat-msg-content";

        const header = document.createElement("div");
        header.className = "bzk-chat-msg-header";

        const senderLabel = document.createElement("span");
        senderLabel.className = "bzk-chat-msg-sender";
        senderLabel.textContent = senderName;

        const timeLabel = document.createElement("span");
        timeLabel.className = "bzk-chat-msg-time";
        if (norm.sendDate) {
            try {
                timeLabel.textContent = norm.sendDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            } catch {
                timeLabel.textContent = "";
            }
        }
        header.append(senderLabel, timeLabel);

        const bubble = document.createElement("div");
        bubble.className = "bzk-chat-message-bubble " + (isSentByMe ? "outgoing" : "incoming");

        // Messages are plain text only; text is never turned into a link or an image source.
        const textNode = document.createElement("div");
        textNode.className = "bzk-chat-message-text";
        textNode.textContent = effectiveText;
        bubble.appendChild(textNode);

        content.append(header, bubble);
        row.append(avatar, content);

        this.messagesArea.appendChild(row);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    private renderEmptyState() {
        const emptyState = document.createElement("div");
        emptyState.className = "bzk-chat-empty-state";
        const title = document.createElement("strong");
        title.textContent = localText("Site.OnlineChat.EmptyTitle") || "Start conversation";
        const description = document.createElement("span");
        description.textContent = localText("Site.OnlineChat.EmptyDescription") || "No messages yet.";
        emptyState.append(title, description);
        this.messagesArea.appendChild(emptyState);
    }

    protected clearMessages() {
        this.messagesArea.replaceChildren();
        this.renderEmptyState();
    }

    protected removeEmptyState() {
        this.messagesArea.querySelector(".bzk-chat-empty-state")?.remove();
    }
}
