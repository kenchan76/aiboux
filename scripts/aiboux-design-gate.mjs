#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const stageArgIndex = process.argv.indexOf("--stage");
const stage = stageArgIndex === -1 ? "all" : process.argv[stageArgIndex + 1];
const allowedStages = new Set(["code", "preview", "all"]);

if (!allowedStages.has(stage)) {
  console.error("Usage: node scripts/aiboux-design-gate.mjs --stage <code|preview|all>");
  process.exit(2);
}

const checks = [];

function addCheck(name, ok, details = "") {
  checks.push({ name, ok, details });
}

function run(command, args) {
  return spawnSync(command, args, { encoding: "utf8", shell: false });
}

function outputOf(result) {
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}

function readText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function getPreviewUrl() {
  return (
    process.env.AIBOUX_PREVIEW_URL ||
    readText("all_log/preview_url.txt").trim() ||
    readText("all_log/core_delivery_detail_print_preview_url.txt").trim()
  );
}

function checkScreenshots() {
  const screenshots = [
    "output/playwright/core-documents-redesign/delivery-detail-design-v5-1980.png",
    "output/playwright/core-documents-redesign/delivery-detail-design-v5-1650.png",
    "output/playwright/core-documents-redesign/delivery-detail-design-v5-1440.png",
    "output/playwright/core-documents-redesign/delivery-detail-design-v5-1366.png",
  ];

  for (const file of screenshots) {
    addCheck(`screenshot exists: ${file}`, existsSync(file), existsSync(file) ? "found" : "missing");
  }
}

function checkPreview() {
  const previewUrl = getPreviewUrl();
  addCheck("public preview URL exists", Boolean(previewUrl), previewUrl || "missing");
  if (!previewUrl) return;

  const head = run("curl", ["-sSI", "-L", previewUrl]);
  const headText = outputOf(head);
  addCheck("public preview URL HTTP 200", head.status === 0 && /HTTP\/[0-9.]+\s+200/i.test(headText), head.status === 0 ? "checked" : `curl exit=${head.status}`);

  const body = run("curl", ["-sS", "-L", previewUrl]);
  const bodyText = outputOf(body);
  addCheck("public preview body readable", body.status === 0 && bodyText.length > 0, body.status === 0 ? "body fetched" : `curl exit=${body.status}`);

  const assetRefs = [...bodyText.matchAll(/(?:href|src|component-url|renderer-url)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => url.includes("_astro") || /\.(css|js)(\?|$)/.test(url));
  addCheck("public preview has CSS/JS asset refs", assetRefs.length > 0, `assets=${assetRefs.length}`);

  let cssOk = false;
  let jsOk = false;
  for (const asset of assetRefs.slice(0, 16)) {
    const assetUrl = asset.startsWith("http") ? asset : new URL(asset, previewUrl).toString();
    const assetHead = run("curl", ["-sSI", "-L", assetUrl]);
    const assetHeadText = outputOf(assetHead);
    const ok = assetHead.status === 0 && /HTTP\/[0-9.]+\s+200/i.test(assetHeadText);
    if (/\.css(\?|$)|text\/css/i.test(assetHeadText)) cssOk = cssOk || ok;
    if (/\.js(\?|$)|javascript/i.test(assetHeadText)) jsOk = jsOk || ok;
  }
  addCheck("CSS asset 200", cssOk, "requires at least one CSS asset 200");
  addCheck("JS asset 200", jsOk, "requires at least one JS asset 200");

  const audit = readText("output/playwright/core-documents-redesign/delivery-detail-design-v5-devtools-audit.json");
  let parsed = null;
  try {
    parsed = audit ? JSON.parse(audit) : null;
  } catch {}

  addCheck("document.styleSheets.length > 0", Number(parsed?.stylesheets || 0) > 0, `stylesheets=${parsed?.stylesheets ?? "missing"}`);
  addCheck("no raw blue browser links", parsed?.failedRawBlueLinks === false, `failedRawBlueLinks=${parsed?.failedRawBlueLinks ?? "missing"}`);
  addCheck("no horizontal overflow", Number(parsed?.overflow ?? 999) <= 2, `overflow=${parsed?.overflow ?? "missing"}`);
  addCheck("header action group not clipped", Number(parsed?.actionsRight ?? 99999) <= Number(parsed?.viewportWidth ?? 0) - 8, `actionsRight=${parsed?.actionsRight ?? "missing"}`);
  addCheck("save button visible and not clipped", Number(parsed?.saveRight ?? 99999) <= Number(parsed?.viewportWidth ?? 0) - 8, `saveRight=${parsed?.saveRight ?? "missing"}`);
  addCheck("summary strip height within threshold", Number(parsed?.summaryHeight ?? 999) <= 150, `summaryHeight=${parsed?.summaryHeight ?? "missing"}`);
  addCheck("lines card y within threshold", Number(parsed?.linesY ?? 999) <= 390, `linesY=${parsed?.linesY ?? "missing"}`);
}

if (stage === "code" || stage === "all") checkScreenshots();
if (stage === "preview" || stage === "all") {
  checkScreenshots();
  checkPreview();
}

const failures = checks.filter((check) => !check.ok);

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"}: ${check.name}${check.details ? ` - ${check.details}` : ""}`);
}

if (failures.length > 0) {
  console.error(`AIBOUX_DESIGN_GATE_BLOCKED failures=${failures.length}`);
  process.exit(1);
}

console.log("AIBOUX_DESIGN_GATE_PASS");
