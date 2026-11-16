import { ChatPanel } from "./ChatPanel";

export default function pageInit() {
    const container = document.getElementById("GridDiv");
    if (!container)
        return;

    new ChatPanel({ element: container });
}
