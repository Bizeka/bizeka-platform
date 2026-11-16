import { describe, it, expect } from "vitest";
import { addGridEmptyState } from "../../Modules/Common/GridEmptyState";

function emitter() {
    const handlers: (() => void)[] = [];
    return { subscribe: (h: () => void) => { handlers.push(h); }, fire: () => handlers.forEach(h => h()) };
}

function grid() {
    const domNode = document.createElement("div");
    domNode.innerHTML = "<div class='grid-container'></div>";
    let length = 0;
    return {
        domNode,
        setLength: (value: number) => { length = value; },
        view: {
            getLength: () => length,
            onDataLoading: emitter(),
            onDataLoaded: emitter(),
            onRowCountChanged: emitter()
        }
    };
}

describe("addGridEmptyState", () => {
    it("stays hidden until the first load ends", () => {
        const target = grid();
        const message = addGridEmptyState(target, "None")!;
        expect(message.hidden).toBe(true);
        target.view.onDataLoading.fire();
        expect(message.hidden).toBe(true);
        target.view.onDataLoaded.fire();
        expect(message.hidden).toBe(false);
        expect(message.textContent).toBe("None");
    });

    it("hides when rows arrive and returns when they are gone", () => {
        const target = grid();
        const message = addGridEmptyState(target)!;
        target.view.onDataLoaded.fire();
        target.setLength(3);
        target.view.onRowCountChanged.fire();
        expect(message.hidden).toBe(true);
        target.setLength(0);
        target.view.onRowCountChanged.fire();
        expect(message.hidden).toBe(false);
    });

    it("adds one message when called twice", () => {
        const target = grid();
        expect(addGridEmptyState(target)).toBe(addGridEmptyState(target));
        expect(target.domNode.querySelectorAll(".bzk-grid-empty-state").length).toBe(1);
    });

    it("does nothing without a grid container", () => {
        const target = grid();
        target.domNode.innerHTML = "";
        expect(addGridEmptyState(target)).toBeUndefined();
    });
});
