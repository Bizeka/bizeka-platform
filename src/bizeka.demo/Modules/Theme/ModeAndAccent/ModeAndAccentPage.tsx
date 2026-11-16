import { applyBizekaTheme, clearBizekaTheme, readStoredTheme, type BizekaThemeMode } from "@bizeka/theme";
import { sampleText, SampleInfo, samplePanel } from "../../Common/SampleInfo";

const accents = [
    { name: sampleText("ModeAndAccent.Indigo"), value: "#5267ed" },
    { name: sampleText("ModeAndAccent.Teal"), value: "#0f766e" },
    { name: sampleText("ModeAndAccent.Amber"), value: "#b45309" },
    { name: sampleText("ModeAndAccent.Crimson"), value: "#be123c" }
];

const modeNames: Record<string, string> = {
    light: sampleText("ModeAndAccent.Light"),
    dark: sampleText("ModeAndAccent.Dark"),
    system: sampleText("ModeAndAccent.FollowTheSystem")
};

/** One sentence about the current theme, for example "Mode: Follow the system (now Dark). Accent: Teal." */
function describeTheme() {
    const root = document.documentElement;
    const resolved = root.getAttribute("data-bizeka-mode");
    if (!root.getAttribute("data-bizeka-theme"))
        return sampleText("ModeAndAccent.TheThemeIsRemovedSerenityS");

    const { mode = "system", accent } = readStoredTheme();
    const accentName = accents.find(a => a.value === accent)?.name ?? accent ?? sampleText("ModeAndAccent.Default");
    const modeText = mode === "system"
        ? `${modeNames.system} (${sampleText("ModeAndAccent.Now")} ${modeNames[resolved ?? ""] ?? resolved})`
        : modeNames[mode];
    return `${sampleText("ModeAndAccent.Mode")}: ${modeText}. ${sampleText("ModeAndAccent.Accent")}: ${accentName}.`;
}

export default function pageInit() {
    SampleInfo({
        uses: ["applyBizekaTheme", "initBizekaTheme", "bizeka-theme.css"]
    });

    const status = <span class="demo-theme-status" role="status" /> as HTMLElement;
    const show = () => status.textContent = describeTheme();

    const modeButton = (mode: BizekaThemeMode) =>
        <button type="button" class="btn btn-outline-primary" onClick={() => { applyBizekaTheme({ mode }); show(); }}>{modeNames[mode]}</button>;

    samplePanel().append(<div>
        <p class="demo-theme-current"><b>{sampleText("ModeAndAccent.CurrentTheme")}: </b>{status}</p>
        <h5>{sampleText("ModeAndAccent.Mode")}</h5>
        <div class="d-flex gap-2 flex-wrap mb-3">
            {modeButton("light")}
            {modeButton("dark")}
            {modeButton("system")}
        </div>
        <h5>{sampleText("ModeAndAccent.Accent2")}</h5>
        <div class="d-flex gap-2 flex-wrap mb-3">
            {accents.map(a => <button type="button" class="btn btn-outline-secondary" onClick={() => { applyBizekaTheme({ accent: a.value }); show(); }}>
                <span class="d-inline-block rounded-circle me-1 align-middle" style={{ width: "0.9rem", height: "0.9rem", background: a.value }} />{a.name}
            </button>)}
        </div>
        <div class="d-flex gap-2 flex-wrap mb-3">
            <button type="button" class="btn btn-outline-danger" onClick={() => { clearBizekaTheme(); show(); }}>{sampleText("ModeAndAccent.RemoveTheTheme")}</button>
        </div>
        <h5 class="mt-4">{sampleText("ModeAndAccent.Preview")}</h5>
        <div class="d-flex gap-2 flex-wrap mb-3">
            <button type="button" class="btn btn-primary">{sampleText("ModeAndAccent.Primary")}</button>
            <button type="button" class="btn btn-outline-primary">{sampleText("ModeAndAccent.Outline")}</button>
            <span class="badge bg-primary align-self-center">{sampleText("ModeAndAccent.Badge")}</span>
        </div>
        <div class="alert alert-info">{sampleText("ModeAndAccent.AnInformationMessageOnTheCurrent")}</div>
        <div class="row g-2" style={{ maxWidth: "36rem" }}>
            <div class="col-sm-6"><input type="text" class="form-control" placeholder={sampleText("ModeAndAccent.TextInput")} aria-label={sampleText("ModeAndAccent.TextInput")} /></div>
            <div class="col-sm-6"><select class="form-select" aria-label={sampleText("ModeAndAccent.Select")}><option>{sampleText("ModeAndAccent.Select")}</option></select></div>
        </div>
    </div>);

    applyBizekaTheme();
    show();
    // The header menu changes the mode too.
    new MutationObserver(show).observe(document.documentElement, { attributes: true, attributeFilter: ["data-bizeka-mode", "data-bizeka-theme"] });
}
