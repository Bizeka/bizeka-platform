import { build } from "@serenity-is/tsbuild";

await build({ external: ["sweetalert2", "@splidejs/*", "glightbox"],  keepNames: true, splitting: false });
