import { Widget, WidgetProps } from "@serenity-is/corelib";
import { ChatPanel } from "./ChatPanel";
import { localText } from "@serenity-is/corelib";

export class ChatToggleWidget extends Widget<any> {

    private modalContainer!: HTMLDivElement;
    private modalCloseButton!: HTMLButtonElement;
    protected chatPanel!: ChatPanel;
    private isOpen: boolean = false;
    private suppressToggleClick = false;

    constructor(props: WidgetProps<any>) {
        super(props);


        this.renderToggleBtn();
        this.renderModal();
    }

    private renderToggleBtn() {
        this.domNode.classList.add("bzk-chat-toggle-btn");
        this.domNode.setAttribute("role", "button");
        this.domNode.setAttribute("tabindex", "0");
        this.domNode.setAttribute("aria-label", localText("Site.OnlineChat.OpenChat"));
        this.domNode.title = localText("Site.OnlineChat.OpenChat");
        this.domNode.innerHTML = "<i class='fa fa-comments'></i>";

        this.domNode.addEventListener("click", event => {
            if (this.suppressToggleClick) {
                this.suppressToggleClick = false;
                event.preventDefault();
                return;
            }

            this.toggleModal();
        });
        this.domNode.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                this.toggleModal();
            }
        });
        this.enableDesktopDrag();
    }

    private enableDesktopDrag() {
        let activePointerId: number | undefined;
        let startX = 0;
        let startY = 0;
        let startRight = 0;
        let startBottom = 0;
        let moved = false;

        const isDesktop = () => window.matchMedia("(min-width: 992px)").matches;
        const clamp = (value: number, min: number, max: number) =>
            Math.min(Math.max(value, min), Math.max(min, max));

        const applyPosition = (right: number, bottom: number) => {
            const rect = this.domNode.getBoundingClientRect();
            const inset = 8;
            const maxRight = window.innerWidth - rect.width - inset;
            const maxBottom = window.innerHeight - rect.height - inset;
            const nextRight = clamp(right, inset, maxRight);
            const nextBottom = clamp(bottom, inset, maxBottom);

            this.domNode.style.right = `${nextRight}px`;
            this.domNode.style.bottom = `${nextBottom}px`;
        };

        const savePosition = () => {
            try {
                const rect = this.domNode.getBoundingClientRect();
                window.localStorage.setItem("bzk.onlinechat.toggle.position.v1", JSON.stringify({
                    right: Math.max(8, window.innerWidth - rect.right),
                    bottom: Math.max(8, window.innerHeight - rect.bottom)
                }));
            }
            catch {
            }
        };

        const restorePosition = () => {
            if (!isDesktop()) {
                this.domNode.style.removeProperty("right");
                this.domNode.style.removeProperty("bottom");
                return;
            }

            try {
                const raw = window.localStorage.getItem("bzk.onlinechat.toggle.position.v1");
                if (!raw)
                    return;

                const position = JSON.parse(raw) as { right?: unknown; bottom?: unknown };
                if (typeof position.right === "number" && typeof position.bottom === "number")
                    applyPosition(position.right, position.bottom);
            }
            catch {
            }
        };

        this.domNode.addEventListener("pointerdown", event => {
            if (!isDesktop() || event.button !== 0)
                return;

            activePointerId = event.pointerId;
            startX = event.clientX;
            startY = event.clientY;
            const rect = this.domNode.getBoundingClientRect();
            startRight = window.innerWidth - rect.right;
            startBottom = window.innerHeight - rect.bottom;
            moved = false;
            this.domNode.setPointerCapture?.(event.pointerId);
        });

        this.domNode.addEventListener("pointermove", event => {
            if (activePointerId !== event.pointerId)
                return;

            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;
            if (!moved && Math.hypot(deltaX, deltaY) < 4)
                return;

            moved = true;
            this.domNode.classList.add("is-dragging");
            event.preventDefault();
            applyPosition(startRight - deltaX, startBottom - deltaY);
        });

        const finishDrag = (event: PointerEvent) => {
            if (activePointerId !== event.pointerId)
                return;

            if (moved) {
                this.suppressToggleClick = true;
                savePosition();
            }

            this.domNode.classList.remove("is-dragging");
            this.domNode.releasePointerCapture?.(event.pointerId);
            activePointerId = undefined;
        };

        this.domNode.addEventListener("pointerup", finishDrag);
        this.domNode.addEventListener("pointercancel", finishDrag);
        window.addEventListener("resize", restorePosition);
        restorePosition();
    }

    private renderModal() {
        this.modalContainer = document.createElement("div");
        this.modalContainer.classList.add("bzk-chat-modal-container");
        this.modalContainer.setAttribute("role", "dialog");
        this.modalContainer.setAttribute("aria-label", localText("Site.OnlineChat.Chats"));
        this.modalContainer.setAttribute("aria-hidden", "true");

        document.body.appendChild(this.modalContainer);

        const panelHost = document.createElement('div');
        panelHost.className = 'bzk-chat-panel-host';
        this.modalContainer.appendChild(panelHost);
        this.chatPanel = this.createChatPanel(panelHost);
        this.modalContainer.addEventListener("bzk-chat-close", () => this.closeModal());

        this.modalCloseButton = document.createElement("button");
        this.modalCloseButton.type = "button";
        this.modalCloseButton.className = "bzk-chat-modal-close";
        this.modalCloseButton.title = localText("Site.OnlineChat.CloseChat");
        this.modalCloseButton.setAttribute("aria-label", localText("Site.OnlineChat.CloseChat"));
        const closeIcon = document.createElement("i");
        closeIcon.className = "fa fa-times";
        closeIcon.setAttribute("aria-hidden", "true");
        this.modalCloseButton.appendChild(closeIcon);
        this.modalCloseButton.addEventListener("click", () => this.closeModal());
        this.modalContainer.appendChild(this.modalCloseButton);
    }

    protected createChatPanel(container: HTMLElement): ChatPanel {
        return new ChatPanel({
            element: container,
            isMiniature: true
        });
    }

    private toggleModal() {
        if (this.isOpen) {
            this.closeModal();
        }
        else {
            this.isOpen = true;
            this.modalContainer.classList.remove("is-closing");
            this.modalContainer.classList.add("is-open");
            this.modalContainer.setAttribute("aria-hidden", "false");
            requestAnimationFrame(() => {
                if (this.isOpen)
                    this.modalContainer.classList.add("is-visible");
            });
            this.domNode.setAttribute("aria-label", localText("Site.OnlineChat.CloseChat"));
            this.domNode.title = localText("Site.OnlineChat.CloseChat");
            this.domNode.innerHTML = "<i class='fa fa-times'></i>";
        }
    }

    private closeModal() {
        if (!this.isOpen)
            return;

        this.isOpen = false;
        this.modalContainer.classList.remove("is-visible");
        this.modalContainer.classList.add("is-closing");
        this.modalContainer.setAttribute("aria-hidden", "true");
        this.domNode.setAttribute("aria-label", localText("Site.OnlineChat.OpenChat"));
        this.domNode.title = localText("Site.OnlineChat.OpenChat");
        this.domNode.innerHTML = "<i class='fa fa-comments'></i>";
        setTimeout(() => {
            if (!this.isOpen)
                this.modalContainer.classList.remove("is-open", "is-closing");
        }, 200);
    }
}
