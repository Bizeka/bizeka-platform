import { readThemeSources, parseTokenBlock } from "./theme-utils.mjs";

const { tokens, overrides } = await readThemeSources();
const failures = [];

const requiredAliases = [
    "--s-card-bg", "--s-card-border", "--s-input-bg", "--s-input-text",
    "--s-tabs-text", "--s-tabs-text-active", "--s-tool-icon", "--s-tool-button",
    "--bizeka-control-edge", "--bizeka-control-shadow", "--bizeka-control-shadow-focus"
];
for (const alias of requiredAliases) {
    if (!overrides.includes(`${alias}:`))
        failures.push(`missing Serenity alias ${alias}`);
}

const requiredComponents = [
    ["input[type=\"checkbox\"]", "dark checkbox surface and edge"],
    [".form-check-input", "Bootstrap checkbox surface and edge"],
    [".s-Toolbar .tool-button.delete-button", "delete toolbar label and edge"],
    [".s-Toolbar .tool-button.delete-button.disabled", "disabled delete toolbar contrast"],
    [".s-Toolbar .tool-button.apply-changes-button .button-inner > i", "apply toolbar icon contrast"],
    [".s-ImageUploadEditor", "image upload surface"],
    [".s-MultipleImageUploadEditor", "multiple image upload surface"],
    [".s-FileUploadEditor > ul.file-items", "file upload list surface"],
    [".s-FileUploadEditor > ul.file-items:empty", "empty file upload surface"],
    [".upload-progress", "upload progress surface"],
    [".inplace-button", "lookup inplace button edge"],
    [".inplace-button b::before", "lookup inplace icon contrast"],
    [".select2-container .select2-search-choice", "multi-select chip edge and shadow"],
    ["section.content", "content panel inset and border"]
];
for (const [selector, description] of requiredComponents) {
    if (!overrides.includes(selector))
        failures.push(`missing ${description} selector ${selector}`);
}

const fieldsRule = overrides.match(/\.field\.dynamic-fields-field\s*\{([\s\S]*?)\}/)?.[1] ?? "";
if (!fieldsRule.includes("flex-wrap: nowrap"))
    failures.push("the dynamic fields editor must not wrap, or its list leaves the form on phones");

// Serenity gives phone grids the height of all their rows; on a fixed page they must scroll inside the grid.
const phoneGrid = overrides.match(/\.full-height-page section\.content > \.s-DataGrid > \.grid-container\s*\{([\s\S]*?)\}/)?.[1] ?? "";
for (const declaration of ["min-height: 0", "overflow-y: auto !important"]) {
    if (!phoneGrid.includes(declaration))
        failures.push(`phone grid container must set ${declaration} so the rows scroll on a fixed page`);
}

if (!overrides.includes(".button-inner > i") ||
    !overrides.includes("--bizeka-accent-contrast"))
    failures.push("primary toolbar icons must use the readable accent-contrast token");

const contentRule = overrides.match(/section\.content\s*\{([\s\S]*?)\}/)?.[1] ?? "";
for (const declaration of ["padding:", "margin:", "border:", "box-shadow:"]) {
    if (!contentRule.includes(declaration))
        failures.push(`content panel must define ${declaration} for an inset, bordered surface`);
}

// Bootstrap keeps its light subtle colors unless data-bs-theme is set, so alerts stay light in dark mode.
const darkBlocks = {
    "dark mode": parseTokenBlock(overrides, ':root[data-bizeka-theme="bizeka"][data-bizeka-mode="dark"],'),
    "system dark mode": parseTokenBlock(overrides, ':root[data-bizeka-theme="bizeka"]:not([data-bizeka-mode="light"]):not([data-bizeka-mode="dark"]):not([data-bzk-mode]) {')
};
for (const [mode, block] of Object.entries(darkBlocks)) {
    for (const color of ["primary", "secondary", "success", "info", "warning", "danger"]) {
        for (const suffix of ["bg-subtle", "border-subtle", "text-emphasis"]) {
            if (!block[`--bs-${color}-${suffix}`])
                failures.push(`${mode} must set --bs-${color}-${suffix} for alerts`);
        }
    }
}

// Serene's sidebar pane has a fixed height and its menu never scrolls; open groups pushed items off screen.
const sidebarMenu = overrides.match(/\.s-sidebar-pane > \.s-sidebar-menu\s*\{([\s\S]*?)\}/)?.[1] ?? "";
if (!/overflow-y:\s*auto/.test(sidebarMenu) || !/min-height:\s*0/.test(sidebarMenu))
    failures.push("the sidebar menu must scroll inside its pane (overflow-y: auto, min-height: 0)");

// Serenity gives every .field .editor flex: 1 1 auto, which stretched boolean checkboxes across the form.
const checkbox = overrides.match(/input\[type="checkbox"\],\s*\r?\n:root\[data-bizeka-theme="bizeka"\] \.form-check-input \{([\s\S]*?)\}/)?.[1] ?? "";
if (!/flex:\s*0 0 auto/.test(checkbox))
    failures.push("checkboxes must not grow inside a form field (flex: 0 0 auto)");

if (!tokens.includes("--bizeka-text-muted: #626b84"))
    failures.push("light muted text token must preserve 4.5:1 contrast on muted surfaces");

if (failures.length) {
    console.error("Theme component contract failed:");
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exitCode = 1;
} else {
    console.log("Theme component contract passed (controls, toolbar, and upload surfaces covered).");
}
