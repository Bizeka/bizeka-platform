import { DataGrid, type ToolButton } from "@serenity-is/corelib";
import { sampleText, layoutGrid, SampleInfo, samplePanel } from "../../Common/SampleInfo";
import { GridFormattersColumns } from "../../ServerTypes/GridFormattersColumns";

interface ProjectItem {
    Id: number;
    Project: string;
    Stage: string;
    StageColor: string;
    Owner: string;
    OwnerColor: string;
    Billable: boolean;
    StartMonth: string;
    Phone: string;
}

const items: ProjectItem[] = [
    { Id: 1, Project: sampleText("GridFormatters.WarehouseScanners"), Stage: sampleText("GridFormatters.Planning"), StageColor: "#dbeafe", Owner: "Deniz", OwnerColor: "#3b82f6", Billable: true, StartMonth: "2026-11", Phone: "2125550147" },
    { Id: 2, Project: sampleText("GridFormatters.CustomerPortal"), Stage: sampleText("GridFormatters.InProgress"), StageColor: "#fef3c7", Owner: "Ada", OwnerColor: "#d97706", Billable: true, StartMonth: "2026-09", Phone: "2165550199" },
    { Id: 3, Project: sampleText("GridFormatters.InternalWiki"), Stage: sampleText("GridFormatters.OnHold"), StageColor: "#fee2e2", Owner: "Kerem", OwnerColor: "#ef4444", Billable: false, StartMonth: "2026-06", Phone: "3125550123" },
    { Id: 4, Project: sampleText("GridFormatters.InvoiceExport"), Stage: sampleText("GridFormatters.Done"), StageColor: "#dcfce7", Owner: "Selin", OwnerColor: "#16a34a", Billable: true, StartMonth: "2026-03", Phone: "2325550175" }
];

export default function pageInit() {
    SampleInfo({
        uses: ["ColoredColumnFormatter", "FontColorColumnFormatter", "YesNoColoredFormatter", "MonthYearFormatter", "PhoneFormatter"]
    });

    const panel = samplePanel();

    const grid = new ProjectGrid({
        element: el => {
            el.classList.add("bzk-project-grid");
            panel.append(el);
        }
    });
    grid.view.setItems(items, true);
    layoutGrid(grid);

    // Below 480px the grid is hidden and this card list shows the same formatted values.
    panel.append(cardList());
}

function cardStyle() {
    const style = document.createElement("style");
    style.textContent = `
        .bzk-project-cards { display: none; gap: 12px; flex-direction: column; }
        @media (max-width: 480px) {
            .bzk-project-grid { display: none; }
            .bzk-project-cards { display: flex; }
        }
        .bzk-project-card { border: 1px solid var(--bizeka-border, #e2e8f0); border-radius: 12px; padding: 14px 16px;
            background: var(--bizeka-surface, #fff); display: grid; gap: 8px; cursor: pointer; text-align: start;
            font: inherit; color: inherit; width: 100%; }
        .bzk-project-card:focus-visible { outline: 2px solid var(--bizeka-focus-ring, #5267ed); outline-offset: 2px; }
        .bzk-project-card[aria-pressed="true"] { border-color: var(--bizeka-accent, #5267ed); box-shadow: 0 0 0 1px var(--bizeka-accent, #5267ed) inset; }
        .bzk-project-card h4 { margin: 0; font-size: 1rem; }
        .bzk-project-card dl { display: grid; grid-template-columns: auto 1fr; gap: 6px 12px; margin: 0; font-size: .9rem; }
        .bzk-project-card dt { color: var(--bizeka-muted, #64748b); }
        .bzk-project-card dd { margin: 0; }
        .bzk-project-pill { display: inline-block; padding: 2px 10px; border-radius: 999px; font-weight: 600; color: #1f2937; }
    `;
    return style;
}

function element(tag: string, className?: string, text?: string) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function cardList() {
    const list = element("div", "bzk-project-cards");
    list.prepend(cardStyle());
    for (const item of items) {
        // A card is a toggle button: tap or Enter selects it, the selection is announced with aria-pressed.
        const card = element("button", "bzk-project-card") as HTMLButtonElement;
        card.type = "button";
        card.setAttribute("aria-pressed", "false");
        card.appendChild(element("h4", undefined, item.Project));

        const details = element("dl");
        const addRow = (label: string, value: HTMLElement) => {
            details.appendChild(element("dt", undefined, label));
            const dd = element("dd");
            dd.appendChild(value);
            details.appendChild(dd);
        };
        const stage = element("span", "bzk-project-pill", item.Stage);
        stage.style.background = item.StageColor;
        addRow(sampleText("GridFormatters.Stage"), stage);

        const owner = element("span", undefined, item.Owner);
        owner.style.color = item.OwnerColor;
        addRow(sampleText("GridFormatters.Owner"), owner);
        addRow(sampleText("GridFormatters.Billable"), element("span", undefined,
            item.Billable ? sampleText("GridFormatters.Yes") : sampleText("GridFormatters.No")));

        card.appendChild(details);
        card.addEventListener("click", () => {
            const pressed = card.getAttribute("aria-pressed") !== "true";
            card.setAttribute("aria-pressed", String(pressed));
        });
        list.appendChild(card);
    }
    return list;
}

export class ProjectGrid extends DataGrid<ProjectItem, {}> {
    static override [Symbol.typeInfo] = this.registerClass("Bizeka.Demo.ProjectGrid");

    protected override getColumnsKey() { return GridFormattersColumns.columnsKey; }
    protected override getIdProperty() { return "Id"; }
    protected override getGridCanLoad() { return false; }
    protected override usePager() { return false; }
    protected override getInitialTitle(): string { return ""; }
    protected override getButtons(): ToolButton[] { return []; }
}
