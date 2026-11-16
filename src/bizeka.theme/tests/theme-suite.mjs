import { spawnSync } from "node:child_process";

const strict = process.argv.includes("--strict");
const checks = [
    ["contract", "theme-contract.mjs", []],
    ["first-paint", "theme-first-paint.mjs", []],
    ["css-hygiene", "theme-css-hygiene.mjs", []],
    ["components", "theme-component-contract.mjs", []],
    ["contrast", "theme-contrast.mjs", strict ? ["--strict"] : []],
    ["visual", "theme-visual.mjs", []]
];
let exitCode = 0;

for (const [name, file, args] of checks) {
    const result = spawnSync(process.execPath, [`./tests/${file}`, ...args], {
        cwd: process.cwd(),
        encoding: "utf8"
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.status !== 0) {
        exitCode = 1;
        console.error(`Theme ${name} check failed (exit ${result.status ?? "unknown"}).`);
    }
}

if (exitCode === 0)
    console.log(`Theme suite passed${strict ? " in strict mode" : ""}.`);
else
    console.error(`Theme suite failed${strict ? " in strict mode" : ""}; see the individual check output above.`);

process.exitCode = exitCode;
