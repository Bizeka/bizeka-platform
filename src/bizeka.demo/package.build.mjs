import { build } from "esbuild";

await build({
    entryPoints: ["Modules/index.ts"],
    outfile: "dist/index.js",
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    external: ["@serenity-is/*", "@bizeka/*"]
});
