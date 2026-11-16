import { Authorization } from "@serenity-is/corelib";
import { ChatToggleWidget } from "./ChatToggleWidget";

export function initializeOnlineChat() {
    const path = window.location.pathname.toLowerCase();
    
    // Do not initialize if user is not authenticated, on login page, or already on full chat page
    if (!Authorization.userDefinition?.Username || 
        document.body.classList.contains("login-page") ||
        document.querySelector(".login-box") != null ||
        path.indexOf("/account/login") >= 0 ||
        path.indexOf("/onlinechat") >= 0) {
        return;
    }

    // Initialize if authorized
    // Keep the initializer safe when a host imports it from more than one
    // bundle or re-runs its common script after navigation.
    if (document.getElementById("bzk-onlinechat-host")) {
        return;
    }
    if (Authorization.hasPermission("OnlineChat:General")) {
        const container = document.createElement("div");
        container.id = "bzk-onlinechat-host";
        document.body.appendChild(container);

        new ChatToggleWidget({ element: container });
    }
}
