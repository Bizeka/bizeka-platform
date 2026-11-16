import { ChatPanel } from "./ChatPanel";

export default function pageInit() {
    const container = document.getElementById('ChatPanelContainer');
    if (!container)
        return;

    new ChatPanel({ 
        element: container, 
        isMiniature: false 
    });
}
