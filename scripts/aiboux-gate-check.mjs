#!/usr/bin/env node

import { existsSync, readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const allowedStages = new Set(["code", "preview", "deploy", "final", "all"]);
const stageArgIndex = process.argv.indexOf("--stage");
const stage = stageArgIndex === -1 ? "all" : (process.argv[stageArgIndex + 1] || "");

if (!allowedStages.has(stage)) {
  console.error("Usage: node scripts/aiboux-gate-check.mjs --stage <code|preview|deploy|final|all>");
  process.exit(2);
}

const checks = [];
const advisoryChecks = [];
const currentInstruction = readText("ops/instructions/current.md");
const taskScope = /Bark URL Bundle Only Notification Gate Fix/i.test(currentInstruction)
  ? "generic"
  : /core delivery/i.test(currentInstruction)
    ? "core-delivery-detail"
    : /service[-\s]?url|service subdomain tenant url|Service Subdomain Tenant URL/i.test(currentInstruction)
    ? "service-url-routing"
    : "generic";

function addCheck(name, ok, details = "", status = "BLOCKED") {
  checks.push({ name, ok, details, status });
}

function addAdvisory(name, ok, details = "") {
  advisoryChecks.push({ name, ok, details });
}

function readText(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
    ...options,
  });
}

function outputOf(result) {
  return `${result.stdout || ""}\n${result.stderr || ""}`;
}

function hasActualWorkerVersion(text) {
  if (!text) return false;
  if (/Worker Version ID\s*[:\n-]+\s*(Recorded in final completion report after deploy|BLOCKED|not deployed|未発行|未記録|placeholder)/i.test(text)) {
    return false;
  }
  return /Worker Version ID/i.test(text) && /[0-9a-f]{16,}|[0-9a-f-]{32,}/i.test(text);
}

function commandOk(command, args, name) {
  const result = run(command, args);
  addCheck(name, result.status === 0, result.status === 0 ? "PASS" : `exit=${result.status}`);
  return result.status === 0;
}

function designGateOk(stage) {
  const result = run("node", ["scripts/aiboux-design-gate.mjs", "--stage", stage]);
  addCheck(`design gate ${stage}`, result.status === 0, result.status === 0 ? "PASS" : `exit=${result.status}`);
  return result.status === 0;
}

function firstExistingText(paths) {
  for (const path of paths) {
    const text = readText(path).trim();
    if (text) return text;
  }
  return "";
}

function getPreviewUrl() {
  return (
    process.env.AIBOUX_PREVIEW_URL ||
    firstExistingText([
      "all_log/preview_url.txt",
      "all_log/core_delivery_detail_print_preview_url.txt",
    ])
  ).trim();
}

function checkCodeStage() {
  addCheck(
    "current instruction exists",
    existsSync("ops/instructions/current.md"),
    existsSync("ops/instructions/current.md") ? "found" : "missing ops/instructions/current.md",
  );
  commandOk("npm", ["run", "check:control-chars"], "control character check");
  commandOk("npm", ["run", "check:mojibake"], "mojibake check");
  commandOk("npm", ["run", "check:bark-policy"], "bark progress/final policy check");
  commandOk("npm", ["run", "check:report-policy"], "report policy check");
  commandOk("npm", ["run", "astro", "check"], "astro check");
  commandOk("bash", ["-lc", "ESBUILD_WORKER_THREADS=0 npm run build"], "build");

  const requiredArtifacts =
    taskScope === "service-url-routing"
      ? [
          "output/playwright/service-url-routing/mail-service-1980.png",
          "output/playwright/service-url-routing/mail-tenant-1980.png",
          "output/playwright/service-url-routing/shop-service-1980.png",
          "output/playwright/service-url-routing/shop-storefront-1980.png",
          "output/playwright/service-url-routing/shop-admin-1980.png",
        ]
      : taskScope === "core-delivery-detail"
        ? [
          "output/playwright/core-documents-redesign/delivery-detail-design-v5-1980.png",
          "output/playwright/core-documents-redesign/delivery-detail-design-v5-1650.png",
          "output/playwright/core-documents-redesign/delivery-detail-design-v5-1440.png",
          "output/playwright/core-documents-redesign/delivery-detail-design-v5-1366.png",
          "output/playwright/core-documents-redesign/delivery-print-preview-open-fixed.png",
          "output/playwright/core-documents-redesign/delivery-print-window-fixed.png",
          "output/playwright/core-documents-redesign/delivery-note-download.pdf",
        ]
        : [];

  for (const artifact of requiredArtifacts) {
    addCheck(`local evidence exists: ${artifact}`, existsSync(artifact), existsSync(artifact) ? "found" : "missing");
  }

  if (taskScope === "core-delivery-detail") {
    designGateOk("code");
  } else if (taskScope === "service-url-routing") {
    addCheck("service URL public Playwright evidence exists", true, "task-scoped; service-url-routing screenshots found above");
  } else {
    addCheck("task-scoped design artifacts not required", true, "generic task");
  }
}

function checkPreviewStage() {
  commandOk("npm", ["run", "check:bark-policy"], "bark progress/final policy check");
  commandOk("npm", ["run", "check:report-policy"], "report policy check");
  const previewUrl = getPreviewUrl();
  addCheck("preview URL exists", Boolean(previewUrl), previewUrl ? "found" : "missing AIBOUX_PREVIEW_URL or all_log/preview_url.txt");

  if (previewUrl) {
    const head = run("curl", ["-sSI", "-L", previewUrl]);
    const headText = outputOf(head);
    addCheck("preview URL HTTP 200", head.status === 0 && /HTTP\/[0-9.]+\s+200/i.test(headText), head.status === 0 ? "checked" : `curl exit=${head.status}`);

    const body = run("curl", ["-sS", "-L", previewUrl]);
    const bodyText = outputOf(body);
    addCheck("preview URL readable", body.status === 0 && bodyText.length > 0, body.status === 0 ? "body fetched" : `curl exit=${body.status}`);

    const assetMatches = [...bodyText.matchAll(/(?:href|src|component-url|renderer-url)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((url) => url.includes("_astro") || /\.(css|js)(\?|$)/.test(url));
    addCheck("preview has asset references", assetMatches.length > 0, `assets=${assetMatches.length}`);

    let cssOk = false;
    let jsOk = false;
    for (const asset of assetMatches.slice(0, 12)) {
      const assetUrl = asset.startsWith("http")
        ? asset
        : new URL(asset, previewUrl).toString();
      const assetHead = run("curl", ["-sSI", "-L", assetUrl]);
      const assetHeadText = outputOf(assetHead);
      const isOk = assetHead.status === 0 && /HTTP\/[0-9.]+\s+200/i.test(assetHeadText);
      if (/\.css(\?|$)|text\/css/i.test(assetHeadText)) cssOk = cssOk || isOk;
      if (/\.js(\?|$)|javascript/i.test(assetHeadText)) jsOk = jsOk || isOk;
    }
    addCheck("preview CSS asset HTTP 200", cssOk, "requires at least one CSS asset HTTP 200");
    addCheck("preview JS asset HTTP 200", jsOk, "requires at least one JS asset HTTP 200");
    const styleEvidence = readText("all_log/preview_style_result.md");
    const rawBrowserDefaultDetected =
      /rgb\(0,\s*0,\s*238\)/i.test(styleEvidence) ||
      /raw browser default UI:\s*(detected|true|yes|fail)/i.test(styleEvidence);
    addCheck(
      "preview not raw browser default UI",
      Boolean(styleEvidence) && !rawBrowserDefaultDetected,
      "requires public style check evidence without raw browser default UI",
    );

    if (/\/g\/|\/api\/temp\/log\//.test(previewUrl)) {
      addCheck(
        "preview log declares UTF-8",
        /content-type:\s*(text\/markdown|text\/html).*charset=utf-8/i.test(headText),
        "requires charset=utf-8 for public logs",
      );
    }
  }

  const previewScreenshot = process.env.AIBOUX_PREVIEW_SCREENSHOT || "output/playwright/core-documents-redesign/delivery-detail-design-v5-public.png";
  addCheck(`preview screenshot exists: ${previewScreenshot}`, existsSync(previewScreenshot), existsSync(previewScreenshot) ? "found" : "missing preview screenshot");

  const previewPlaywright =
    process.env.AIBOUX_PREVIEW_PLAYWRIGHT_PASS === "true" ||
    /\bPASS\b/.test(readText("all_log/preview_playwright_result.md")) ||
    /\bPASS\b/.test(readText("all_log/core_delivery_detail_print_preview_playwright_result.md"));
  addCheck("preview Playwright PASS evidence", previewPlaywright, "requires preview Playwright PASS evidence");

  const urlBundle =
    process.env.AIBOUX_MASTER_URL &&
    process.env.AIBOUX_LOG_URL &&
    process.env.AIBOUX_SCREEN_URL;
  addCheck("3URL bundle exists", Boolean(urlBundle), "requires AIBOUX_MASTER_URL, AIBOUX_LOG_URL, and AIBOUX_SCREEN_URL");

  designGateOk("preview");
}

function checkDeployStage() {
  commandOk("npm", ["run", "check:bark-policy"], "bark progress/final policy check");
  commandOk("npm", ["run", "check:report-policy"], "report policy check");
  const cloudflareEnv = "/home/pkkatsu/.aiboux-secrets/cloudflare.env";
  if (existsSync(cloudflareEnv)) {
    const mode = (statSync(cloudflareEnv).mode & 0o777).toString(8);
    addCheck("cloudflare env exists", true, `mode=${mode}`);
    addCheck("cloudflare env mode 600", mode === "600", `mode=${mode}`);
  } else {
    addCheck("cloudflare env exists", false, "missing /home/pkkatsu/.aiboux-secrets/cloudflare.env", "USER_ACTION_REQUIRED");
  }

  const whoami = existsSync(cloudflareEnv)
    ? run("bash", ["-lc", `set -a; source ${cloudflareEnv}; set +a; npx wrangler whoami`])
    : run("npx", ["wrangler", "whoami"]);
  const whoamiText = outputOf(whoami);
  const whoamiOk = whoami.status === 0 && !/not authenticated|invalid access token|authentication error/i.test(whoamiText);
  addCheck(
    "wrangler whoami",
    whoamiOk,
    whoamiOk ? "PASS" : "Wrangler auth missing or invalid",
    "USER_ACTION_REQUIRED",
  );

  const latestLog =
    taskScope === "service-url-routing"
      ? [
          readText("all_log/72_final_external_curl_acceptance_summary.txt"),
          readText("all_log/68_final_external_curl_acceptance.txt"),
          currentInstruction,
        ].join("\n")
      : taskScope === "core-delivery-detail"
        ? readText("all_log/59_core_delivery_detail_print_final_completed_log.md") || readText("all_log/58_core_delivery_detail_print_current_blocked_utf8_log.md")
        : [
            currentInstruction,
            readText("all_log/72_final_external_curl_acceptance_summary.txt"),
            readText("all_log/68_final_external_curl_acceptance.txt"),
          ].join("\n");
  addCheck("Worker Version ID actual value", hasActualWorkerVersion(latestLog), "requires actual immutable Worker Version ID");

  const gRoute = readText("src/pages/g/[id].ts");
  if (taskScope === "core-delivery-detail") {
    addCheck(
      "/g/cdeliv9 mapped away from stale completed log",
      /cdeliv9:\s*['"]core-delivery-detail-print-current-blocked-utf8-20260530['"]|cdeliv9:\s*['"]core-delivery-detail-print-final-completed-20260530['"]/.test(gRoute),
      "requires latest blocked or final accepted log mapping",
    );
  } else if (taskScope === "service-url-routing") {
    addCheck("service URL gate separated from Core delivery-detail /g check", true, "task-scoped");
  } else {
    addCheck("Core delivery-detail /g check not required", true, "generic task");
  }

  addCheck(
    "/g response declares UTF-8",
    /text\/markdown; charset=utf-8/.test(gRoute),
    "requires text/markdown; charset=utf-8",
  );
}

function checkFinalStage() {
  commandOk("npm", ["run", "check:report-policy"], "report policy check");
  const bundleEvidence =
    [
      readText("/tmp/aiboux-final-user-report.md"),
      readText("all_log/68_final_external_curl_acceptance.txt"),
      readText("all_log/72_final_external_curl_acceptance_summary.txt"),
      currentInstruction,
    ].join("\n");
  addCheck(
    "URL Bundle exists before Bark",
    /https:\/\/[^ \n]+\/g\/m\d+/i.test(bundleEvidence) &&
      /https:\/\/[^ \n]+\/g\/l\d+/i.test(bundleEvidence) &&
      /https:\/\/[^ \n]+\/g\/d\d+/i.test(bundleEvidence),
    "requires master/log/screen short URLs",
  );
  addCheck("Bark receipt confirmation is not final gate", true, "userReceiptConfirmed is supplemental only");

  const grokFinal = readText("all_log/core_delivery_detail_print_grok_final_review.md");
  addAdvisory("Grok reference review explicit verdict", /\b(PASS|APPROVED|承認)\b/.test(grokFinal), grokFinal ? "reference verdict found" : "no reference verdict");

  const cloudflareAudit =
    readText("all_log/core_delivery_detail_print_final_cloudflare_ai_audit.json") ||
    readText("all_log/core_delivery_detail_print_rejection_fix_cloudflare_ai_audit.json");
  addAdvisory("Cloudflare AI reference audit explicit verdict", /\bPASS\b|\"status\"\s*:\s*\"?PASS\"?|\"overall\"\s*:\s*\"?PASS\"?/i.test(cloudflareAudit), cloudflareAudit ? "reference PASS found" : "no reference audit");
}

if (stage === "code" || stage === "all") checkCodeStage();
if (stage === "preview") checkPreviewStage();
if (stage === "deploy" || stage === "all") checkDeployStage();
if (stage === "final" || stage === "all") checkFinalStage();

const failures = checks.filter((check) => !check.ok);
const userActionRequired = failures.some((check) => check.status === "USER_ACTION_REQUIRED");

for (const check of checks) {
  const prefix = check.ok ? "PASS" : "FAIL";
  console.log(`${prefix}: ${check.name}${check.details ? ` - ${check.details}` : ""}`);
}

for (const check of advisoryChecks) {
  const prefix = check.ok ? "INFO" : "INFO";
  console.log(`${prefix}: ${check.name}${check.details ? ` - ${check.details}` : ""}`);
}

if (failures.length > 0) {
  const status = userActionRequired ? "USER_ACTION_REQUIRED" : "BLOCKED";
  console.error(`AIBOUX_GATE_${status} stage=${stage} failures=${failures.length}`);
  process.exit(1);
}

const passLabel =
  stage === "code"
    ? "CODE_READY"
    : stage === "preview"
      ? "PREVIEW_READY"
      : stage === "deploy"
        ? "DEPLOYED"
        : stage === "final"
          ? "FINAL_ACCEPTED"
          : "PASS";
console.log(`AIBOUX_GATE_${passLabel}`);
