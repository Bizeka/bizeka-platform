import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const css = await readFile(resolve(root, "wwwroot/bizeka-theme/bizeka-overrides.css"), "utf8");
const tokens = await readFile(resolve(root, "wwwroot/bizeka-theme/tokens.css"), "utf8");
const runtime = await readFile(resolve(root, "Modules/index.ts"), "utf8");

const required = [
    [tokens, "data-bizeka-mode=\"dark\"", "dark mode tokens"],
    [tokens, "--bizeka-accent", "accent token"],
    [css, ".s-DataGrid .slick-header", "SlickGrid header override"],
    [css, ".modal-content", "dialog surface override"],
    [css, ".sidebar-menu", "menu surface override"],
    [runtime, "applyBizekaTheme", "runtime theme API"]
];

for (const [source, expected, description] of required) {
    if (!source.includes(expected))
        throw new Error(`Missing ${description}: ${expected}`);
}

const forbiddenGeometry = /(?:^|\n).*\.slick-(?:viewport|canvas|row|cell)[^{]*\{[^}]*\b(?:position|height|width|overflow)\s*:/s;
if (forbiddenGeometry.test(css))
    throw new Error("SlickGrid overrides must not change base geometry.");

console.log("Bizeka.Theme contract checks passed.");
