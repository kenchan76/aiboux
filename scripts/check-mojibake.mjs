#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = [
  "all_log",
  "AIBOUX_MASTER_DOCUMENT.md",
  "AGENTS.md",
  "AGENT_RULES.md",
  "docs",
  "src/lib/server/tempLogShares.ts",
  "src/pages/g/[id].ts",
];

const mojibakePattern = /縺|繧|譛|螳|謇|邨|霑|蜈|逕|髢|繝|譁|�/;
const textExtensions = new Set([
  ".md",
  ".mdx",
  ".txt",
  ".ts",
  ".tsx",
  ".astro",
  ".js",
  ".mjs",
  ".json",
]);

function shouldCheck(path) {
  if (!path.includes(".")) return true;
  return [...textExtensions].some((extension) => path.endsWith(extension));
}

function collect(path, files = []) {
  const stat = statSync(path, { throwIfNoEntry: false });
  if (!stat) return files;

  if (stat.isDirectory()) {
    for (const entry of readdirSync(path)) {
      if (entry === "node_modules" || entry === ".git" || entry === "dist") continue;
      collect(join(path, entry), files);
    }
    return files;
  }

  if (stat.isFile() && shouldCheck(path)) {
    files.push(path);
  }
  return files;
}

const files = roots.flatMap((root) => collect(root));
const failures = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const match = content.match(mojibakePattern);
  if (match) {
    failures.push(`${file}: contains mojibake marker "${match[0]}"`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`MOJIBAKE_CHECK_OK files=${files.length}`);
