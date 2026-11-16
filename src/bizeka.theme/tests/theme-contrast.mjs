import { parseTokenBlock, readThemeSources, requireTokens, colorToken,
    contrastRatio, relativeLuminance, formatRatio } from "./theme-utils.mjs";

const { tokens: tokensCss, overrides } = await readThemeSources();
const base = parseTokenBlock(tokensCss, ":root {");
const lightOverrides = parseTokenBlock(tokensCss, ':root[data-bizeka-theme="bizeka"] {');
const darkOverrides = parseTokenBlock(tokensCss, ':root[data-bizeka-theme="bizeka"][data-bizeka-mode="dark"]');
const light = { ...base, ...lightOverrides };
const dark = { ...base, ...darkOverrides };

const required = [
    "--bizeka-canvas", "--bizeka-surface", "--bizeka-surface-raised",
    "--bizeka-surface-muted", "--bizeka-text", "--bizeka-text-muted",
    "--bizeka-border", "--bizeka-border-strong", "--bizeka-accent",
    "--bizeka-accent-contrast"
];
requireTokens(light, required, "light");
requireTokens(dark, required, "dark");
requireTokens(darkOverrides, [
    "--bizeka-canvas", "--bizeka-surface", "--bizeka-surface-raised",
    "--bizeka-surface-muted", "--bizeka-text", "--bizeka-text-muted",
    "--bizeka-border", "--bizeka-border-strong"
], "dark mode counterpart");

const pairs = [
    ["--bizeka-text", "--bizeka-canvas", 4.5],
    ["--bizeka-text", "--bizeka-surface", 4.5],
    ["--bizeka-text", "--bizeka-surface-muted", 4.5],
    ["--bizeka-text-muted", "--bizeka-surface", 4.5],
    ["--bizeka-text-muted", "--bizeka-surface-muted", 4.5],
    ["--bizeka-accent-contrast", "--bizeka-accent", 3.0]
];

const warnings = [];
const failures = [];
const measurements = [];

for (const [mode, tokens] of [["light", light], ["dark", dark]]) {
    const backgrounds = ["--bizeka-canvas", "--bizeka-surface", "--bizeka-surface-raised", "--bizeka-surface-muted"];
    const foregrounds = ["--bizeka-text", "--bizeka-text-muted"];
    const backgroundLuminances = backgrounds.map(name => relativeLuminance(colorToken(tokens, name, mode)));
    const maxBackgroundLuminance = Math.max(...backgroundLuminances);
    const minBackgroundLuminance = Math.min(...backgroundLuminances);
    const foregroundLuminance = Math.min(...foregrounds.map(name => relativeLuminance(colorToken(tokens, name, mode))));

    if (mode === "dark" && maxBackgroundLuminance >= 0.45)
        failures.push(`dark backgrounds are too light (max luminance ${maxBackgroundLuminance.toFixed(3)})`);
    if (mode === "dark" && foregroundLuminance <= 0.45)
        failures.push(`dark foreground tokens are too dark (min luminance ${foregroundLuminance.toFixed(3)})`);
    if (mode === "light" && minBackgroundLuminance <= 0.65)
        failures.push(`light backgrounds are too dark (min expected > 0.65, got ${minBackgroundLuminance.toFixed(3)})`);

    for (const [foreground, background, minimum] of pairs) {
        const foregroundColor = colorToken(tokens, foreground, mode);
        const backgroundColor = colorToken(tokens, background, mode);
        const foregroundTokenLuminance = relativeLuminance(foregroundColor);
        const backgroundTokenLuminance = relativeLuminance(backgroundColor);
        const ratio = contrastRatio(foregroundColor, backgroundColor);
        measurements.push({ mode, foreground, background, ratio, minimum });
        if (ratio < minimum)
            failures.push(`${mode}: ${foreground} on ${background} is ${formatRatio(ratio)} (minimum ${minimum}:1)`);

        // WCAG's 4.5:1 text recommendation is reported separately for the
        // accent component because existing themes may intentionally use a
        // larger/bolder button label. Strict mode can promote this warning.
        if (foreground === "--bizeka-accent-contrast" && ratio < 4.5)
            warnings.push(`${mode}: ${foreground} on ${background} is ${formatRatio(ratio)}; 4.5:1 is recommended for normal text`);

        if (foregroundTokenLuminance > 0.65 && backgroundTokenLuminance > 0.65)
            failures.push(`${mode}: ${foreground} and ${background} are both light-toned; check the semantic token pairing`);
    }
}

for (const name of required.filter(x => !["--bizeka-accent", "--bizeka-accent-contrast"].includes(x))) {
    if (light[name] === dark[name])
        failures.push(`${name} has no distinct dark-mode counterpart (light and dark values are both ${light[name]})`);
}

const requiredOverrideSelectors = [
    ".flatpickr-calendar", ".select2-container", ".s-DataGrid .slick-row.odd",
    ".s-DataGrid .slick-row.even", "section.content"
];
for (const selector of requiredOverrideSelectors) {
    if (!overrides.includes(selector))
        failures.push(`missing contrast-sensitive override selector: ${selector}`);
}

for (const warning of warnings)
    console.warn(`Contrast warning: ${warning}`);

if (failures.length) {
    console.error("Theme contrast audit failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
}

if (process.argv.includes("--strict") && warnings.length) {
    console.error("Strict contrast mode failed on recommendations:");
    for (const warning of warnings) console.error(`  - ${warning}`);
    process.exitCode = 1;
}

if (!failures.length && !(process.argv.includes("--strict") && warnings.length))
    console.log(`Theme contrast audit passed (${measurements.length} semantic pairs checked).`);
