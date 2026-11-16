import { localText } from "@serenity-is/corelib";

const styleId = "bizeka-grid-empty-state-style";

const css = `
.bzk-grid-has-empty-state .grid-container { position: relative; }
.bzk-grid-empty-state { position: absolute; inset: 40% 1rem auto; z-index: 1; text-align: center; pointer-events: none;
    color: var(--bizeka-text-muted, var(--bs-secondary-color, #6c757d)); }
`;

export interface GridEmptyStateTarget {
    domNode: HTMLElement;
    view: {
        getLength(): number;
        onDataLoading: { subscribe(handler: () => void): void };
        onDataLoaded: { subscribe(handler: () => void): void };
        onRowCountChanged: { subscribe(handler: () => void): void };
    };
}

/**
 * Shows a message inside a Serenity grid when it has no rows, instead of an empty area that
 * looks unfinished. Never while the first page is loading. Calling it twice has no extra effect.
 */
export function addGridEmptyState(grid: GridEmptyStateTarget, text?: string): HTMLElement | undefined {
    const container = grid.domNode.querySelector<HTMLElement>(".grid-container");
    if (!container) return undefined;

    const existing = container.querySelector<HTMLElement>(".bzk-grid-empty-state");
    if (existing) return existing;

    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    const message = document.createElement("div");
    message.className = "bzk-grid-empty-state";
    message.setAttribute("role", "status");
    message.textContent = text ?? localText("Site.Extensions.NoRecords", "No records to show");
    message.hidden = true;
    grid.domNode.classList.add("bzk-grid-has-empty-state");
    container.appendChild(message);

    let loading = false;
    const update = () => { message.hidden = loading || grid.view.getLength() > 0; };
    grid.view.onDataLoading.subscribe(() => { loading = true; update(); });
    grid.view.onDataLoaded.subscribe(() => { loading = false; update(); });
    grid.view.onRowCountChanged.subscribe(update);
    return message;
}
