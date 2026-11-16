import { rmSync } from "node:fs";
import { build } from "esbuild";

rmSync("dist", { recursive: true, force: true });

await build({
    entryPoints: ["index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    external: ["@serenity-is/*", "@bizeka/*"]
});
