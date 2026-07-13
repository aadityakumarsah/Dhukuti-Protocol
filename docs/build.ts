import tailwind from "bun-plugin-tailwind";
import { cp, rm } from "node:fs/promises";
import path from "node:path";

const outdir = path.join(process.cwd(), "dist");
await rm(outdir, { recursive: true, force: true });

const entrypoints = [...new Bun.Glob("src/**/*.html").scanSync()];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [tailwind],
  minify: true,
  target: "browser",
  sourcemap: "linked",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

for (const output of result.outputs) {
  console.log(` ${path.relative(process.cwd(), output.path)}  ${(output.size / 1024).toFixed(1)} KB`);
}

// Copy static assets
const imagesDir = path.join(process.cwd(), "src", "images");
const outImagesDir = path.join(outdir, "images");
try {
  await cp(imagesDir, outImagesDir, { recursive: true });
  console.log(` Copied images to ${outImagesDir}`);
} catch (e) {
  console.error(" Failed to copy images:", e);
}
