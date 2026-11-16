import { rmSync } from "node:fs";
import { build } from "esbuild";

// Remove stale declarations from previous module variants before packaging.
rmSync("dist", { recursive: true, force: true });

await build({
    entryPoints: ["Modules/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    packages: "external",
    external: ["@serenity-is/*", "@bizeka/*"],
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
    tsconfig: "./tsconfig.json"
});
