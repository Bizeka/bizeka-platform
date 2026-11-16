import { ChatPanel } from "@bizeka/onlinechat";
// The package entry carries no styles; the stylesheet is a separate export.
import "@bizeka/onlinechat/styles.css";
import { SampleInfo, samplePanel } from "../../Common/SampleInfo";

export default function pageInit() {
    SampleInfo({
        uses: ["ChatPanel", "ChatHub (SignalR)", "ChatRoomEndpoint", "ChatMessageEndpoint"]
    });

    const container = <div class="demo-chat-container" /> as HTMLElement;
    samplePanel().append(container);
    new ChatPanel({ element: container, isMiniature: false });
}
