#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_MARKDOWN_OUTPUT = "/tmp/aiboux-final-user-report.md";
const DEFAULT_HTML_OUTPUT = "/tmp/aiboux-final-user-report.html";

export function sanitizeReportText(value) {
  return String(value ?? "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\uFFFD/g, "")
    .normalize("NFC");
}

function parseArgs(argv) {
  const args = {
    input: "",
    markdownOutput: DEFAULT_MARKDOWN_OUTPUT,
    htmlOutput: DEFAULT_HTML_OUTPUT,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") {
      args.input = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--markdown-output") {
      args.markdownOutput = argv[index + 1] ?? "";
      index += 1;
    } else if (arg === "--html-output") {
      args.htmlOutput = argv[index + 1] ?? "";
      index += 1;
    }
  }

  if (!args.input) {
    throw new Error("Missing --input <report.json>");
  }

  return args;
}

function sanitizeArray(values) {
  if (!Array.isArray(values)) return [];
  return values.map((value) => sanitizeReportText(value)).filter(Boolean);
}

function validateUrl(label, value) {
  const sanitized = sanitizeReportText(value);
  try {
    const url = new URL(sanitized);
    if (!["https:", "http:"].includes(url.protocol)) {
      throw new Error("Unsupported URL protocol");
    }
  } catch (error) {
    throw new Error(`${label} is not a valid URL`);
  }
  return sanitized;
}

function renderMarkdown(rawInput) {
  const title = sanitizeReportText(rawInput.title || "AIBOUX Report");
  const status = sanitizeReportText(rawInput.status || "BLOCKED_REPORT_FORMAT");
  const masterUrl = validateUrl("masterUrl", rawInput.masterShortUrl ?? rawInput.masterUrl);
  const logUrl = validateUrl("logUrl", rawInput.logShortUrl ?? rawInput.logUrl);
  const screenUrl = validateUrl("screenUrl", rawInput.screenShortUrl ?? rawInput.screenUrl);
  const summary = sanitizeArray(rawInput.summary);
  const verifications = sanitizeArray(rawInput.verification);
  const notes = sanitizeArray(rawInput.notes);
  const bark = rawInput.bark ?? {};
  const barkNotification = sanitizeReportText(bark.notification || "not sent");
  const barkReason = sanitizeReportText(bark.reason || "Bark is sent only after URL Bundle output and is not a completion gate.");

  const lines = [
    `# ${title}`,
    "",
    "## Status",
    status,
    "",
  ];

  if (summary.length) {
    lines.push("## Summary");
    for (const item of summary) lines.push(`- ${item}`);
    lines.push("");
  }

  if (verifications.length) {
    lines.push("## Verification");
    for (const item of verifications) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push(
    "## Bark",
    `- notification: ${barkNotification}`,
    `- reason: ${barkReason}`,
    "",
  );

  if (notes.length) {
    lines.push("## Notes");
    for (const item of notes) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push(
    "## URLs",
    `- マスター: ${masterUrl}`,
    `- ログ: ${logUrl}`,
    `- 画面: ${screenUrl}`,
    "",
  );

  return sanitizeReportText(`${lines.join("\n").trimEnd()}\n`);
}

function escapeHtml(value) {
  return sanitizeReportText(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderHtml(markdown) {
  return sanitizeReportText(`<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AIBOUX Final User Report</title>
  <style>
    body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65;margin:24px;max-width:1100px}
    pre{white-space:pre-wrap;background:#f7f7f8;border:1px solid #e4e4e7;border-radius:8px;padding:16px}
  </style>
</head>
<body>
  <h1>AIBOUX Final User Report</h1>
  <pre>${escapeHtml(markdown)}</pre>
</body>
</html>
`);
}

function assertClean(label, value) {
  const bad = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|\uFFFD/g;
  const matches = [...String(value).matchAll(bad)];
  if (!matches.length) return;
  const first = matches[0];
  const code = first[0].charCodeAt(0).toString(16).padStart(2, "0");
  throw new Error(`${label} contains disallowed character index=${first.index} hex=0x${code}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const raw = fs.readFileSync(args.input, "utf8");
  assertClean("input JSON", raw);
  const input = JSON.parse(raw);
  const markdown = renderMarkdown(input);
  const html = renderHtml(markdown);

  assertClean("markdown output", markdown);
  assertClean("html output", html);

  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.mkdirSync(path.dirname(args.htmlOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, markdown, "utf8");
  fs.writeFileSync(args.htmlOutput, html, "utf8");
  process.stdout.write(markdown);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
