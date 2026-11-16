import { addGridEmptyState } from "@bizeka/extensions";
import { Fluent, localText, sanitizeHtml } from "@serenity-is/corelib";
import type { SampleSourceFile } from "../ServerTypes/SampleSourceFile";
import { SampleSourceService } from "../ServerTypes/SampleSourceService";
import "./SampleInfo.css";

/** A text of this module, from texts/resources (Site.Demo.<key>). */
export function sampleText(key: string): string {
    return localText("Site.Demo." + key);
}

/**
 * Description card shown above each sample. The collapsible "Source" part lists every
 * file of the sample folder, loaded on first open from the embedded sample sources.
 */
export function SampleInfo(props: {
    /** Platform types the sample is built on, shown as a short list. */
    uses?: string[];
}): HTMLElement {
    const folder = document.querySelector("meta[name='demo-sample-folder']")?.getAttribute("content") ?? "";
    const tabs = <div class="demo-source-tabs" role="tablist" /> as HTMLElement;
    const code = <pre class="demo-source-code"><code /></pre> as HTMLElement;
    let loaded = false;

    const showFile = (file: SampleSourceFile, button: HTMLElement) => {
        tabs.querySelectorAll(".active").forEach(x => x.classList.remove("active"));
        button.classList.add("active");
        code.querySelector("code")!.textContent = file.Text ?? "";
    };

    const loadSources = async () => {
        if (loaded || !folder)
            return;
        loaded = true;
        const response = await SampleSourceService.List({ Folder: folder });
        for (const file of response.Files ?? []) {
            const button = <button type="button" class="btn btn-sm demo-source-tab" role="tab"
                onClick={() => showFile(file, button)}>{file.Name}</button> as HTMLElement;
            tabs.append(button);
        }
        const first = tabs.querySelector<HTMLElement>("button");
        first && first.click();
    };

    // Site.Demo.<Sample>.Intro: short HTML, translated with the rest of the page.
    const description = <div class="demo-sample-description" /> as HTMLElement;
    description.innerHTML = sanitizeHtml(sampleText(folder.split("/").pop() + ".Intro"));

    // On phones the description starts collapsed so the sample itself is visible first.
    const narrow = window.matchMedia("(max-width: 480px)").matches;
    const card = <div class="demo-sample-info">
        <details class="demo-sample-intro" open={!narrow}>
            <summary>{sampleText("Common.AboutThisSample")}</summary>
            {description}
            {props.uses?.length ? <p class="demo-sample-uses"><b>{sampleText("Common.BuiltOn")}</b>
                {props.uses.map((x, i) => <>{i > 0 ? ", " : ""}<code>{x}</code></>)}</p> : null}
        </details>
        <details class="demo-source" onToggle={(e: Event) => (e.target as HTMLDetailsElement).open && void loadSources()}>
            <summary>{sampleText("Common.SourceFiles")}</summary>
            {tabs}
            {code}
        </details>
    </div> as HTMLElement;

    const panel = document.getElementById("PanelDiv");
    panel ? panel.before(card) : document.querySelector("section.content")?.append(card);
    return card;
}

/** A labelled block for values a sample wants to show, for example what a form saves. */
export function SampleOutput(props: { title: string }): HTMLElement & { show(value: any): void } {
    const code = <code /> as HTMLElement;
    const block = <div class="demo-sample-output" hidden>
        <div class="demo-sample-output-title">{props.title}</div>
        <pre>{code}</pre>
    </div> as HTMLElement & { show(value: any): void };
    block.show = (value: any) => {
        code.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
        block.hidden = false;
    };
    return block;
}

/** The sample container rendered by the shared layout. */
export function samplePanel(): HTMLElement {
    return document.getElementById("PanelDiv")!;
}

/** Gives an embedded grid the sample height, a message for no rows, and lets it size its columns. */
export function layoutGrid(grid: Parameters<typeof addGridEmptyState>[0]) {
    grid.domNode.classList.add("demo-sample-grid");
    addGridEmptyState(grid);
    Fluent.trigger(grid.domNode, "layout");
}
