import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await build({
  entryPoints: [path.join(root, "src", "content.ts")],
  bundle: true,
  format: "iife",
  outfile: path.join(dist, "content.js"),
  platform: "browser",
  target: "chrome114",
});

await build({
  entryPoints: [path.join(root, "src", "popup.ts")],
  bundle: true,
  format: "iife",
  outfile: path.join(dist, "popup.js"),
  platform: "browser",
  target: "chrome114",
});

await build({
  entryPoints: [path.join(root, "src", "demo.ts")],
  bundle: true,
  format: "esm",
  outfile: path.join(dist, "demo.js"),
  platform: "node",
  target: "node20",
});

await copyFile(path.join(root, "manifest.json"), path.join(dist, "manifest.json"));
await copyFile(path.join(root, "popup.html"), path.join(dist, "popup.html"));
