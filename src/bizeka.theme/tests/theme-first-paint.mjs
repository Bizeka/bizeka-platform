import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import vm from "node:vm";

const root = resolve(import.meta.dirname, "..");
const script = await readFile(resolve(root, "wwwroot/bizeka-theme/bizeka-theme-init.js"), "utf8");
const runtime = await readFile(resolve(root, "Modules/index.ts"), "utf8");

function run({ storage = {}, storageThrows = false, systemDark = false } = {}) {
    const attributes = { "data-bizeka-mode": "system" };
    const inlineStyles = {};
    const window = {
        localStorage: {
            getItem(key) {
                if (storageThrows)
                    throw new Error("storage disabled");
                return storage[key] ?? null;
            }
        },
        matchMedia: () => ({ matches: systemDark })
    };
    const document = {
        documentElement: {
            setAttribute: (name, value) => { attributes[name] = value; },
            style: { setProperty: (name, value) => { inlineStyles[name] = value; } }
        }
    };
    const CSS = { supports: (_, value) => value.startsWith("#") };
    vm.runInNewContext(script, { window, document, CSS });
    return { mode: attributes["data-bizeka-mode"], theme: attributes["data-bizeka-theme"], accent: inlineStyles["--bizeka-accent"] };
}

const key = "bizeka.theme.bizeka";
const legacyKey = "bizeka_theme_mode";

for (const name of [key, legacyKey])
    assert.ok(runtime.includes(`"${name}"`), `applyBizekaTheme no longer uses the storage key ${name}`);

assert.equal(run({ storage: { [key]: '{"mode":"dark"}' } }).mode, "dark", "saved dark on a light system");
assert.equal(run({ storage: { [key]: '{"mode":"light"}' }, systemDark: true }).mode, "light", "saved light on a dark system");
assert.equal(run({ storage: { [legacyKey]: "dark" } }).mode, "dark", "legacy key");
assert.equal(run({ storage: { [key]: '{"mode":"system"}' }, systemDark: true }).mode, "dark", "saved system resolves");
assert.equal(run({ systemDark: true }).mode, "dark", "nothing saved follows the system");
assert.equal(run().mode, "light", "nothing saved on a light system");
assert.equal(run({ storage: { [key]: "not json" } }).mode, "light", "invalid saved value");
assert.equal(run({ storage: { [key]: '{"mode":"sepia"}' } }).mode, "light", "unknown saved mode");
assert.equal(run({ storage: { [key]: "null" }, systemDark: true }).mode, "dark", "null saved value");
assert.equal(run({ storageThrows: true, systemDark: true }).mode, "dark", "disabled storage");
assert.equal(run().theme, "bizeka", "theme attribute");
assert.equal(run({ storage: { [key]: '{"accent":"#123456"}' } }).accent, "#123456", "saved accent");
assert.equal(run({ storage: { [key]: '{"accent":"url(x)"}' } }).accent, undefined, "rejected accent");

console.log("Bizeka.Theme first paint checks passed.");
