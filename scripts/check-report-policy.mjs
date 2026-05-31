#!/usr/bin/env node

import fs from "node:fs";

const FINAL_STATUSES = new Set(["FINAL_ACCEPTED", "COMPLETED"]);
const INTERMEDIATE_STATUSES = new Set([
  "CODE_READY",
  "PREVIEW_READY",
  "DEPLOYED",
  "BLOCKED",
  "BLOCKED_DESIGN",
  "BLOCKED_PREVIEW",
  "BLOCKED_METHOD",
  "BLOCKED_REPORT_FORMAT",
  "BLOCKED_AGENT_COMPLIANCE",
  "USER_ACTION_REQUIRED",
]);

const targets = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const files = targets.length ? targets : ["/tmp/aiboux-final-user-report.md"];
const badChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]|\uFFFD/;
const longUrl = /https?:\/\/[^\s)]+(?:core\/deliveries\?|document=|preview=delivery-detail)|incentives-scale-uri-clocks|core\/deliveries\?/;
const shortUrl = /^- (マスター|ログ|画面): https?:\/\/[^\s]+(?:\/[mld][0-9]+\.html|\/g\/[mld][0-9]+)$/;

function fail(file, reason) {
  console.error(`REPORT_POLICY_VIOLATION ${file}: ${reason}`);
  process.exitCode = 1;
}

function statusOf(text) {
  const direct = text.match(/^## Status\s*\n([A-Z_]+)/m);
  if (direct) return direct[1];
  const inline = text.match(/\b(CODE_READY|PREVIEW_READY|DEPLOYED|FINAL_ACCEPTED|COMPLETED|USER_ACTION_REQUIRED|BLOCKED(?:_[A-Z]+)?)\b/);
  return inline?.[1] || "";
}

for (const file of files) {
  if (!fs.existsSync(file)) {
    fail(file, "missing file");
    continue;
  }

  const text = fs.readFileSync(file, "utf8");
  if (badChars.test(text)) fail(file, "NUL/control/replacement character found");
  const allowLongUrls = /longUrlAllowed:\s*true|Status\s*\n(?:CODE_READY|PREVIEW_READY|DEPLOYED|BLOCKED|BLOCKED_DESIGN|BLOCKED_PREVIEW|BLOCKED_METHOD|BLOCKED_REPORT_FORMAT|BLOCKED_AGENT_COMPLIANCE|USER_ACTION_REQUIRED)/.test(text);
  if (longUrl.test(text) && !allowLongUrls) fail(file, "long URL or query URL found");

  const status = statusOf(text);
  const isFinal = FINAL_STATUSES.has(status);
  const isIntermediate = INTERMEDIATE_STATUSES.has(status);
  const hasUrls = /^## URLs\s*$/m.test(text);

  if (!status) fail(file, "missing Status");
  if (/Bark[\s\S]*(BARK_DEVICE_KEY|BARK_ENDPOINT=.*\/[A-Za-z0-9_-]{8,}|api\.day\.app\/[A-Za-z0-9_-]{8,})/i.test(text)) {
    fail(file, "Bark secret or endpoint path leaked");
  }

  if (hasUrls) {
    const lines = text.trimEnd().split(/\r?\n/);
    const urlsIndex = lines.findIndex((line) => line === "## URLs");
    if (urlsIndex === -1) {
      fail(file, "URLs marker not found");
    } else {
      const after = lines.slice(urlsIndex + 1);
      if (!after.length) fail(file, "URLs section is empty");
      for (const line of after) {
        if (!shortUrl.test(line)) {
          fail(file, `invalid URL section line: ${line}`);
        }
      }
      const preUrlTail = lines.slice(0, urlsIndex).filter((line) => /^- (マスター|ログ|画面): /.test(line));
      if (preUrlTail.length && isFinal) fail(file, "URL bullets found before final URLs section");
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);
console.log("REPORT_POLICY_CHECK_OK");
