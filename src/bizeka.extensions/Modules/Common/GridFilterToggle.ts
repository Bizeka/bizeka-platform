import { localText } from "@serenity-is/corelib";

const styleId = "bizeka-grid-filter-toggle-style";

const css = `
.tool-button.bzk-filter-toggle { display: none; }
@media (max-width: 480px) {
    .tool-button.bzk-filter-toggle { display: inline-flex; }
    .bzk-filters-collapsed .quick-filters-bar { display: none; }
}
`;

/**
 * Puts a "Filters" button in a Serenity grid's toolbar. At 480 px and below the quick filter
 * bar starts collapsed and the button shows it; above that width the button is hidden and the
 * bar stays visible. Call it once after the grid is laid out, with the grid's DOM element.
 */
export function addGridFilterToggle(gridElement: HTMLElement, text?: string): HTMLElement | undefined {
    const bar = gridElement.querySelector<HTMLElement>(".quick-filters-bar");
    if (!bar) return undefined;

    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // The same markup as Serenity's toolbar buttons, so it joins the button group.
    const toggle = document.createElement("div");
    toggle.className = "tool-button icon-tool-button bzk-filter-toggle";
    toggle.setAttribute("role", "button");
    toggle.tabIndex = 0;
    toggle.setAttribute("aria-expanded", "false");
    const inner = document.createElement("span");
    inner.className = "button-inner";
    const icon = document.createElement("i");
    icon.className = "fa fa-filter text-blue";
    inner.append(icon, " " + (text ?? localText("Site.Extensions.Filters", "Filters")));
    toggle.appendChild(inner);

    gridElement.classList.add("bzk-filters-collapsed");
    const flip = () => {
        const collapsed = gridElement.classList.toggle("bzk-filters-collapsed");
        toggle.setAttribute("aria-expanded", String(!collapsed));
        toggle.classList.toggle("active", !collapsed);
    };
    toggle.addEventListener("click", flip);
    toggle.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            flip();
        }
    });

    const group = gridElement.querySelector(".grid-toolbar .tool-group") ?? bar.parentElement;
    group?.appendChild(toggle);
    return toggle;
}
