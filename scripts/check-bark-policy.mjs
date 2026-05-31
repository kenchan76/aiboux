#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const roots = [
  "ops/instructions/current.md",
  "AIBOUX_MASTER_DOCUMENT.md",
  "AGENTS.md",
  "AGENT_RULES.md",
];

const allowExt = /\.(md|html|ts|tsx|js|mjs|json|astro)$/;
const ngPatterns = [
  /Progress Bark Notification is required when a Codex work unit finishes or pauses/i,
  /Progress notifications are sent whenever a Codex work unit finishes or pauses/i,
  /userReceiptConfirmed=true.*must.*block/i,
  /Bark.*required completion gate/i,
];

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  if (!stat.isDirectory()) return [];
  return fs.readdirSync(target).flatMap((name) => walk(path.join(target, name)));
}

function isHistorical(file, text) {
  if (text.includes("Superseded by `ops/instructions/20260531_codex_execution_contract_v2_bark_final_only.md`")) {
    return true;
  }
  if (file.startsWith("AGENTS.md") || file.startsWith("AGENT_RULES.md")) return true;
  return false;
}

let failed = false;

for (const root of roots) {
  for (const file of walk(root)) {
    if (!allowExt.test(file)) continue;
    let text = fs.readFileSync(file, "utf8");
    if (file === "AIBOUX_MASTER_DOCUMENT.md") {
      text = text.split("Human approval remains required for:")[0] || text;
    }
    if (isHistorical(file, text)) continue;

    const matches = ngPatterns.filter((pattern) => pattern.test(text));
    if (!matches.length) continue;

    failed = true;
    console.error(`BARK_POLICY_VIOLATION ${file}`);
    for (const pattern of matches) {
      console.error(`  pattern=${pattern}`);
    }
  }
}

const master = fs.existsSync("AIBOUX_MASTER_DOCUMENT.md")
  ? fs.readFileSync("AIBOUX_MASTER_DOCUMENT.md", "utf8")
  : "";
const current = fs.existsSync("ops/instructions/current.md")
  ? fs.readFileSync("ops/instructions/current.md", "utf8")
  : "";

const requiredPolicyPatterns = [
  /Bark notification timing is fixed to URL Bundle only/i,
  /Bark may be sent only after the URL Bundle has already been output/i,
  /Bark delivery and receipt confirmation are notification evidence only/i,
  /Bark receipt confirmation is not a completion gate|Bark receipt confirmation is not a completion gate/i,
];

for (const pattern of requiredPolicyPatterns) {
  if (pattern.test(master) || pattern.test(current)) continue;
  failed = true;
  console.error(`BARK_POLICY_MISSING pattern=${pattern}`);
}

if (failed) process.exit(1);
console.log("BARK_POLICY_CHECK_OK");
