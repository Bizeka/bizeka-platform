import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync("package.json", "utf8"));
for (const path of ["dist/index.js", "dist/index.d.ts"])
    if (!existsSync(path)) throw new Error(`${manifest.name}: build before packing; missing ${path}`);
for (const path of ["LICENSE", "THIRD-PARTY-NOTICES.md"])
    copyFileSync(resolve(root, path), path);
