import * as signalR from "@microsoft/signalr";

export class ChatConnection {
    private connection: signalR.HubConnection;
    public onMessageReceived!: (message: any) => void;
    public onMessagesRead?: (messageIds: number[], readByUserId: number) => void;
    public onMessageReactionChanged?: (messageId: number, userId: number, emoji: string, added: boolean) => void;
    public onUserPresence?: (userId: number, displayName: string, isOnline: boolean) => void;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("/chathub")
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.connection.on("ReceiveMessage", (message) => {
            if (this.onMessageReceived) {
                this.onMessageReceived(message);
            }
        });

        this.connection.on("MessagesRead", (messageIds: number[], readByUserId: number) => {
            this.onMessagesRead?.(messageIds, readByUserId);
        });

        this.connection.on("MessageReactionChanged", (messageId: number, userId: number, emoji: string, added: boolean) => {
            this.onMessageReactionChanged?.(messageId, userId, emoji, added);
        });

        this.connection.on("UserPresenceChanged", (userId: number, displayName: string, isOnline: boolean) => {
            this.onUserPresence?.(userId, displayName, isOnline);
        });
    }

    public async start() {
        try {
            if (this.connection.state === signalR.HubConnectionState.Disconnected) {
                await this.connection.start();
            }
        } catch (err) {
            console.error("Bizeka.OnlineChat: SignalR Connection Error: ", err);
            setTimeout(() => this.start(), 5000);
        }
    }

    public async joinRoom(roomId: number): Promise<boolean> {
        if (this.connection.state !== signalR.HubConnectionState.Connected)
            return false;

        await this.connection.invoke("JoinRoom", roomId);
        return true;
    }

    public async leaveRoom(roomId: number) {
        if (this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.invoke("LeaveRoom", roomId);
        }
    }
}
