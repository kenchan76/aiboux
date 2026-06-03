#!/usr/bin/env node

import { execFileSync } from "node:child_process";

const modeArg = process.argv.find((arg) => arg.startsWith("--mode="));
const mode = modeArg ? modeArg.slice("--mode=".length) : "warn";
const validModes = new Set(["warn", "strict"]);

if (!validModes.has(mode)) {
  console.error("Usage: node scripts/check-shop-ui-protection.mjs --mode=<warn|strict>");
  process.exit(2);
}

const protectedPaths = [
  "src/pages/shop",
  "src/components/shop",
  "src/data/shop-sample-data.ts",
  "src/styles",
  "src/assets",
];

const allowUiChange = process.env.AIBOUX_SHOP_UI_CHANGE_APPROVED === "1";
const requiredLog = process.env.AIBOUX_SHOP_UI_CHANGE_LOG || "";

function gitStatusFor(paths) {
  try {
    return execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all", "--", ...paths], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = error?.stderr ? String(error.stderr) : "";
    throw new Error(`git status failed. ${stderr}`.trim());
  }
}

function fail(message, lines = []) {
  console.error(`SHOP_UI_PROTECTION_NG: ${message}`);
  for (const line of lines.slice(0, 80)) console.error(line);
  if (lines.length > 80) console.error(`... ${lines.length - 80} more entries omitted`);
  process.exit(1);
}

const rawStatus = gitStatusFor(protectedPaths);
const dirtyLines = rawStatus
  .split("\n")
  .map((line) => line.trimEnd())
  .filter(Boolean);

if (!dirtyLines.length) {
  console.log(`SHOP_UI_PROTECTION_OK mode=${mode}: protected Shop UI paths are clean`);
  process.exit(0);
}

if (mode === "warn") {
  console.warn("SHOP_UI_PROTECTION_WARN: protected Shop UI paths are dirty. WIP deploy is allowed only with rollback checkpoint evidence.");
  console.warn("Protected paths:");
  for (const path of protectedPaths) console.warn(`- ${path}`);
  console.warn("Dirty entries:");
  for (const line of dirtyLines.slice(0, 80)) console.warn(line);
  if (dirtyLines.length > 80) console.warn(`... ${dirtyLines.length - 80} more entries omitted`);
  process.exit(0);
}

if (!allowUiChange) {
  fail(
    "protected Shop UI paths are dirty. Final acceptance is blocked until UI risk is reviewed.",
    [
      "Set AIBOUX_SHOP_UI_CHANGE_APPROVED=1 only after the user explicitly approves UI changes and a visual evidence log exists.",
      "Protected paths:",
      ...protectedPaths.map((path) => `- ${path}`),
      "Dirty entries:",
      ...dirtyLines,
    ],
  );
}

if (!requiredLog) {
  fail("AIBOUX_SHOP_UI_CHANGE_APPROVED=1 requires AIBOUX_SHOP_UI_CHANGE_LOG=<all_log/...>.");
}

if (!requiredLog.startsWith("all_log/")) {
  fail("AIBOUX_SHOP_UI_CHANGE_LOG must point under all_log/.");
}

console.log("SHOP_UI_PROTECTION_APPROVED_WITH_LOG");
console.log(`SHOP_UI_CHANGE_LOG=${requiredLog}`);
