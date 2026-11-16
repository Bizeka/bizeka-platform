import { readThemeSources } from "./theme-utils.mjs";

const { overrides } = await readThemeSources();
const css = overrides.replace(/\/\*[\s\S]*?\*\//g, "");
const blocks = [];
const stack = [];
let headerStart = 0;

for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") {
        const header = css.slice(headerStart, i).trim();
        const isAtRule = header.startsWith("@");
        const context = stack.filter(x => x.isAtRule).map(x => x.header);
        const block = {
            selector: header,
            bodyStart: i + 1,
            isAtRule,
            context
        };
        stack.push(block);
        if (!isAtRule)
            blocks.push(block);
        headerStart = i + 1;
    } else if (ch === "}") {
        const block = stack.pop();
        if (block && !block.isAtRule)
            block.body = css.slice(block.bodyStart, i);
        headerStart = i + 1;
    }
}

const declarations = new Map();
const failures = [];
let declarationCount = 0;

for (const block of blocks) {
    if (!block.selector)
        continue;

    const selectors = block.selector
        .split(",")
        .map(selector => selector.trim().replace(/\s+/g, " "))
        .filter(Boolean);

    for (const declaration of block.body.split(";")) {
        const colon = declaration.indexOf(":");
        if (colon < 0)
            continue;

        const property = declaration.slice(0, colon).trim().toLowerCase();
        if (!property || property.startsWith("--"))
            continue;

        declarationCount += selectors.length;
        for (const selector of selectors) {
            const context = block.context.length ? ` (${block.context.join(" > ")})` : "";
            const key = `${context}|${selector}|${property}`;
            const previous = declarations.get(key);
            if (previous)
                failures.push(`duplicate ${property} for ${selector}${context} (blocks ${previous} and ${block.selector})`);
            else
                declarations.set(key, block.selector);
        }
    }
}

if (failures.length) {
    console.error("Theme CSS hygiene failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
} else {
    console.log(`Theme CSS hygiene passed (${blocks.length} blocks, ${declarationCount} declarations checked).`);
}
