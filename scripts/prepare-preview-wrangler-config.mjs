#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const distClientDir = join(repoRoot, "dist", "client");

if (!existsSync(distClientDir)) {
  throw new Error("dist/client not found. Run build first.");
}

const sourceCandidates = [
  join(repoRoot, "dist", "server", "wrangler.json"),
  join(repoRoot, "wrangler.json"),
];
const sourcePath = sourceCandidates.find((candidate) => existsSync(candidate));

if (!sourcePath) {
  throw new Error("No generated wrangler config found.");
}

const outputPath = join(repoRoot, "wrangler.preview.generated.json");
const config = JSON.parse(readFileSync(sourcePath, "utf8"));

delete config.configPath;
delete config.userConfigPath;
config.name = "aiboux-preview";
if (config.main === "entry.mjs") {
  config.main = "./dist/server/entry.mjs";
}
config.workers_dev = true;
config.routes = [];
config.triggers = undefined;
config.vars = {
  ...(config.vars || {}),
  AIBOUX_ENV: "preview",
};

config.assets = {
  ...(config.assets || {}),
  directory: "./dist/client",
  binding: config.assets?.binding || "ASSETS",
};

writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify({
    ok: true,
    repoRoot: "<dynamic>",
    source: relative(repoRoot, sourcePath),
    output: relative(repoRoot, outputPath),
    assetsDirectory: config.assets.directory,
    absolutePathWritten: false,
  }),
);
