#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const defaultTargets = [
  "all_log",
  "AIBOUX_MASTER_DOCUMENT.md",
  "AGENTS.md",
  "AGENT_RULES.md",
  "docs",
  "ops/instructions",
  "ops/improvements",
  "src/lib/server/tempLogShares.ts",
  "src/pages/g/[id].ts",
  "/tmp/aiboux-log-share",
  "/tmp/aiboux-final-user-report.md",
  "/tmp/aiboux-final-user-report.html",
  "/tmp/aiboux-final-user-report.stdout.md",
];

const cliTargets = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const targets = cliTargets.length ? cliTargets : defaultTargets;

const bad = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const allowExt = /\.(md|ts|tsx|js|mjs|json|html|astro|css)$/;

function walk(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return [targetPath];
  if (!stat.isDirectory()) return [];

  return fs
    .readdirSync(targetPath)
    .flatMap((name) => walk(path.join(targetPath, name)));
}

let failed = false;

for (const root of targets) {
  for (const file of walk(root)) {
    if (!allowExt.test(file)) continue;

    const text = fs.readFileSync(file).toString("utf8");
    const matches = [...text.matchAll(bad)];
    if (!matches.length) continue;

    failed = true;
    console.error(`CONTROL_CHAR_DETECTED ${file}`);
    for (const match of matches.slice(0, 20)) {
      const code = match[0].charCodeAt(0).toString(16).padStart(2, "0");
      console.error(`  index=${match.index} hex=0x${code}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("CONTROL_CHAR_CHECK_OK");
