import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { root, parseTokenBlock, readThemeSources, colorToken, contrastRatio,
    colorToHex, formatRatio } from "./theme-utils.mjs";

const { tokens: tokensCss } = await readThemeSources();
const base = parseTokenBlock(tokensCss, ":root {");
const themes = {
    light: { ...base, ...parseTokenBlock(tokensCss, ':root[data-bizeka-theme="bizeka"] {') },
    dark: { ...base, ...parseTokenBlock(tokensCss, ':root[data-bizeka-theme="bizeka"][data-bizeka-mode="dark"]') }
};
const snapshotDir = resolve(root, "tests/snapshots");
const update = process.argv.includes("--update");

function esc(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function panel(mode, tokens, x) {
    const canvas = colorToHex(tokens["--bizeka-canvas"]);
    const surface = colorToHex(tokens["--bizeka-surface"]);
    const raised = colorToHex(tokens["--bizeka-surface-raised"]);
    const muted = colorToHex(tokens["--bizeka-surface-muted"]);
    const text = colorToHex(tokens["--bizeka-text"]);
    const textMuted = colorToHex(tokens["--bizeka-text-muted"]);
    const border = colorToHex(tokens["--bizeka-border"]);
    const borderStrong = colorToHex(tokens["--bizeka-border-strong"]);
    const accent = colorToHex(tokens["--bizeka-accent"]);
    const accentContrast = colorToHex(tokens["--bizeka-accent-contrast"]);
    const danger = "#dc3545";
    const ratio = formatRatio(contrastRatio(colorToken(tokens, "--bizeka-text"), colorToken(tokens, "--bizeka-surface")));
    const accentRatio = formatRatio(contrastRatio(colorToken(tokens, "--bizeka-accent-contrast"), colorToken(tokens, "--bizeka-accent")));

    const rows = [0, 1, 2, 3].map(index => {
        const rowColor = index % 2 === 0 ? surface : muted;
        return `<rect x="${x + 24}" y="${310 + index * 27}" width="412" height="26" fill="${rowColor}" stroke="${border}"/><text x="${x + 36}" y="${328 + index * 27}" fill="${text}" font-size="12">${index % 2 ? "odd / alternate row" : "even / base row"}</text>`;
    }).join("");

    return `<g data-mode="${mode}">
  <rect x="${x}" y="0" width="460" height="620" rx="12" fill="${canvas}" stroke="${border}"/>
  <rect x="${x + 1}" y="1" width="458" height="54" rx="11" fill="${raised}"/>
  <text x="${x + 24}" y="34" fill="${text}" font-size="20" font-weight="700">${mode.toUpperCase()} THEME</text>
  <rect x="${x + 24}" y="76" width="412" height="94" rx="8" fill="${surface}" stroke="${border}"/>
  <text x="${x + 40}" y="105" fill="${text}" font-size="15" font-weight="700">Surface and text</text>
  <text x="${x + 40}" y="130" fill="${textMuted}" font-size="12">Primary / muted copy — ${esc(ratio)}</text>
  <rect x="${x + 40}" y="145" width="115" height="8" rx="4" fill="${accent}"/>
  <rect x="${x + 24}" y="188" width="196" height="47" rx="6" fill="${muted}" stroke="${border}"/>
  <text x="${x + 40}" y="217" fill="${text}" font-size="13">Input / Select</text>
  <rect x="${x + 236}" y="188" width="200" height="47" rx="6" fill="${accent}"/>
  <text x="${x + 252}" y="217" fill="${accentContrast}" font-size="13" font-weight="600">Accent button</text>
  <text x="${x + 252}" y="230" fill="${accentContrast}" font-size="9">${esc(accentRatio)}</text>
  <text x="${x + 24}" y="281" fill="${textMuted}" font-size="11" letter-spacing="1">GRID PARITY / BORDER</text>
  ${rows}
  <text x="${x + 24}" y="445" fill="${textMuted}" font-size="11" letter-spacing="1">COMPONENT CONTRAST</text>
  <rect x="${x + 24}" y="460" width="148" height="38" rx="6" fill="${raised}" stroke="${borderStrong}"/>
  <rect x="${x + 38}" y="472" width="14" height="14" rx="3" fill="${surface}" stroke="${borderStrong}"/>
  <text x="${x + 60}" y="485" fill="${text}" font-size="12">Checkbox</text>
  <rect x="${x + 184}" y="460" width="148" height="38" rx="6" fill="${raised}" stroke="${borderStrong}"/>
  <text x="${x + 198}" y="485" fill="${text}" font-size="12">Delete</text>
  <circle cx="${x + 310}" cy="479" r="6" fill="${danger}"/>
  <rect x="${x + 344}" y="460" width="92" height="78" rx="6" fill="${raised}" stroke="${borderStrong}"/>
  <rect x="${x + 352}" y="468" width="76" height="20" rx="3" fill="${surface}" stroke="${border}"/>
  <rect x="${x + 352}" y="496" width="76" height="32" rx="3" fill="${surface}" stroke="${border}"/>
  <text x="${x + 359}" y="482" fill="${text}" font-size="8">Upload</text>
  <text x="${x + 359}" y="514" fill="${textMuted}" font-size="8">empty state</text>
</g>`;
}

function svgFor(mode, tokens) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="620" viewBox="0 0 960 620" role="img" aria-label="Bizeka ${mode} theme token snapshot">
  <title>Bizeka ${mode} theme token snapshot</title>
  ${panel(mode, tokens, 0)}
</svg>
`;
}

await mkdir(snapshotDir, { recursive: true });
const failures = [];
for (const [mode, tokens] of Object.entries(themes)) {
    const path = resolve(snapshotDir, `theme-${mode}.svg`);
    const actual = svgFor(mode, tokens);
    let expected = null;
    try { expected = await readFile(path, "utf8"); } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    if (update || expected === null) {
        await writeFile(path, actual, "utf8");
        console.log(`${expected === null ? "Created" : "Updated"} visual snapshot: ${path}`);
    } else if (expected.replaceAll("\r\n", "\n") !== actual.replaceAll("\r\n", "\n")) {
        failures.push(`${mode}: ${path} differs (run npm run test:visual:update to approve intentional changes)`);
    }
}

if (failures.length) {
    console.error("Theme visual snapshot test failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
} else if (!update) {
    console.log("Theme visual snapshots passed (light + dark SVG baselines).\nSnapshots are deterministic SVG artifacts; no browser/font raster variance is involved.");
}
