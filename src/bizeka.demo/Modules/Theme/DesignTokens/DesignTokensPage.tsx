import { applyBizekaTheme } from "@bizeka/theme";
import { sampleText, SampleInfo, samplePanel } from "../../Common/SampleInfo";

/** The public tokens of bizeka-theme/tokens.css. Hosts and modules may read or override them. */
const tokens: { id: string, group: string, names: string[] }[] = [
    { id: "accent", group: sampleText("DesignTokens.Accent"), names: ["--bizeka-accent", "--bizeka-accent-contrast", "--bizeka-accent-hover", "--bizeka-accent-soft", "--bizeka-focus-ring"] },
    { id: "surfaces", group: sampleText("DesignTokens.Surfaces"), names: ["--bizeka-canvas", "--bizeka-surface", "--bizeka-surface-raised", "--bizeka-surface-muted", "--bizeka-overlay"] },
    { id: "text", group: sampleText("DesignTokens.TextAndBorders"), names: ["--bizeka-text", "--bizeka-text-muted", "--bizeka-border", "--bizeka-border-strong"] },
    { id: "shape", group: sampleText("DesignTokens.Shape"), names: ["--bizeka-radius-sm", "--bizeka-radius-md", "--bizeka-radius-lg", "--bizeka-shadow-color", "--bizeka-shadow-sm", "--bizeka-shadow-md", "--bizeka-font-sans"] }
];

export default function pageInit() {
    SampleInfo({
        uses: ["tokens.css"]
    });

    applyBizekaTheme();

    const valueCells = new Map<string, HTMLElement>();
    const showValues = () => {
        const style = getComputedStyle(document.documentElement);
        valueCells.forEach((cell, name) => cell.textContent = style.getPropertyValue(name).trim());
    };

    const sections = tokens.map(t => {
        const rows = t.names.map(name => {
            const value = <small /> as HTMLElement;
            valueCells.set(name, value);
            return <tr data-token={name}>
                <td style={{ width: "3rem" }}>
                    <div style={{
                        width: "2rem", height: "2rem", borderRadius: "var(--bizeka-radius-sm)",
                        border: "1px solid var(--bizeka-border)",
                        background: /shadow-(sm|md)|radius|font/.test(name) ? "var(--bizeka-surface)" : `var(${name})`,
                        boxShadow: /shadow-(sm|md)/.test(name) ? `var(${name})` : undefined
                    }} />
                </td>
                <td><code>{name}</code></td>
                <td class="text-muted">{value}</td>
            </tr> as HTMLElement;
        });
        return <section class="demo-sample-section demo-token-group" id={`tokens-${t.id}`}>
            <h5>{t.group}</h5>
            <table class="table table-sm align-middle" style={{ maxWidth: "48rem" }}>
                <tbody>{rows}</tbody>
            </table>
        </section> as HTMLElement;
    });

    const noMatch = <p class="text-muted" hidden>{sampleText("DesignTokens.NoTokenMatchesThisSearch")}</p> as HTMLElement;
    const filter = (text: string) => {
        const term = text.trim().toLowerCase();
        let shown = 0;
        for (const section of sections) {
            let visible = 0;
            section.querySelectorAll<HTMLElement>("tr").forEach(row => {
                row.hidden = !(row.dataset.token ?? "").includes(term);
                if (!row.hidden) visible++;
            });
            section.hidden = !visible;
            shown += visible;
        }
        noMatch.hidden = shown > 0;
    };

    const searchLabel = sampleText("DesignTokens.SearchTokens");
    samplePanel().append(<div>
        <div class="demo-token-index">
            <nav aria-label={sampleText("DesignTokens.TokenGroups")}>
                {tokens.map((t, i) => <a class="btn btn-sm btn-outline-secondary" href={`#tokens-${t.id}`} onClick={(e: Event) => {
                    e.preventDefault();
                    filter("");
                    sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
                }}>{t.group} <span class="badge text-bg-secondary">{t.names.length}</span></a>)}
            </nav>
            <input type="search" class="form-control" placeholder={searchLabel} aria-label={searchLabel}
                onInput={(e: Event) => filter((e.target as HTMLInputElement).value)} />
        </div>
        {noMatch}
        {sections}
    </div>);

    showValues();
    // Values follow the header menu.
    new MutationObserver(showValues).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bizeka-mode", "style"] });
}
