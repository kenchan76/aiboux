#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const truthy = new Set(["1", "true", "yes", "on", "y", "はい"]);
const secretEnvPath = "/home/pkkatsu/.aiboux-secrets/bark.env";
const defaultGroup = "AIBOUX";
const controlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function stripControlChars(value) {
  return String(value || "").replace(controlChars, "");
}

function readArg(name) {
  const flag = `--${name}`;
  const withEquals = `${flag}=`;
  const equalsArg = process.argv.find((value) => value.startsWith(withEquals));
  if (equalsArg) return stripControlChars(equalsArg.slice(withEquals.length));

  const index = process.argv.indexOf(flag);
  if (index === -1) return "";
  const next = process.argv[index + 1];
  if (!next || next.startsWith("--")) return "true";
  return stripControlChars(next);
}

function envOrArg(envName, argName) {
  return stripControlChars(process.env[envName] || readArg(argName) || "");
}

function readBundleField(envName, argNames) {
  for (const argName of argNames) {
    const value = readArg(argName);
    if (value) return stripControlChars(value);
  }
  return stripControlChars(process.env[envName] || "");
}

function parseShellValue(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadBarkSecretEnvIfNeeded() {
  if (process.env.BARK_ENABLED && process.env.BARK_ENDPOINT && process.env.BARK_DEVICE_KEY) {
    return;
  }

  if (!existsSync(secretEnvPath)) {
    return;
  }

  const content = readFileSync(secretEnvPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?(BARK_[A-Z_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = parseShellValue(rawValue);
    }
  }
}

function normalizeEndpoint(rawEndpoint) {
  const endpoint = String(rawEndpoint || "").trim();
  if (!endpoint) return "";

  try {
    const parsed = new URL(endpoint);
    return parsed.origin;
  } catch {
    return endpoint.replace(/\/+$/, "");
  }
}

function endpointHost(endpoint) {
  try {
    return new URL(normalizeEndpoint(endpoint)).host;
  } catch {
    return "invalid-endpoint";
  }
}

function extractDeviceKey(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return "";

  try {
    const parsed = new URL(value);
    return parsed.pathname.split("/").filter(Boolean)[0] || "";
  } catch {
    return value.replace(/^\/+|\/+$/g, "");
  }
}

function validDeviceKey(deviceKey) {
  return Boolean(deviceKey) && !/^https?:/i.test(deviceKey) && !deviceKey.includes("/");
}

function buildBody() {
  const explicitBody = envOrArg("BARK_BODY", "body");
  const task = envOrArg("BARK_TASK", "task") || "AIBOUX implementation";
  const verification = envOrArg("BARK_VERIFICATION", "verification") || "Verification completed";
  const bundle = readUrlBundle();

  const lines = [
    `作業名: ${task}`,
    `検証結果: ${verification}`,
    `最終状態: ${bundle.finalStatus}`,
    `マスターURL: ${bundle.masterUrl}`,
    `ログURL: ${bundle.logUrl}`,
    `画面URL: ${bundle.screenUrl}`,
    `Worker Version ID: ${bundle.workerVersionId}`,
  ];

  if (explicitBody) {
    lines.push("", explicitBody);
  }

  return lines.join("\n");
}

function jsonLog(payload) {
  process.stdout.write(`${JSON.stringify({ provider: "bark", secretLogged: false, ...payload })}\n`);
}

function isFinalStage(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[-\s]/g, "_");
  return normalized === "final" || normalized === "final_accepted" || normalized === "completed";
}

function normalizePurpose(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[-\s]/g, "_");
  if (normalized === "progress" || normalized === "final") return normalized;
  return "";
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text.trim()) return { raw: "", json: null };

  try {
    return { raw: "", json: JSON.parse(text) };
  } catch {
    return { raw: "non-json", json: null };
  }
}

function isBarkSuccess(response, responseJson) {
  if (!response.ok) return false;
  if (!responseJson) return false;

  if (responseJson.code !== undefined) {
    return Number(responseJson.code) === 200;
  }

  if (responseJson.success !== undefined) {
    return Boolean(responseJson.success);
  }

  if (responseJson.ok !== undefined) {
    return Boolean(responseJson.ok);
  }

  if (typeof responseJson.message === "string") {
    return responseJson.message.toLowerCase() === "success";
  }

  return false;
}

function responseErrorReason(response, parsed) {
  if (!response.ok) return `HTTP_${response.status}`;
  if (!parsed.json) return parsed.raw === "non-json" ? "BARK_NON_JSON_RESPONSE" : "BARK_EMPTY_RESPONSE";
  if (parsed.json.code !== undefined) return `BARK_CODE_${parsed.json.code}`;
  return "BARK_API_ERROR";
}

async function sendJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const parsed = await parseResponse(response);
  const delivered = isBarkSuccess(response, parsed.json);
  return { response, parsed, delivered };
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function readUrlBundle() {
  return {
    masterUrl: readBundleField("AIBOUX_MASTER_URL", ["master-url", "master", "master-short-url"]),
    logUrl: readBundleField("AIBOUX_LOG_URL", ["log-url", "log", "log-short-url", "short-log-url"]),
    screenUrl: readBundleField("AIBOUX_SCREEN_URL", ["screen-url", "screen", "screen-short-url"]),
    workerVersionId: envOrArg("WORKER_VERSION_ID", "worker-version-id"),
    finalStatus: envOrArg("AIBOUX_FINAL_STATUS", "final-status") || envOrArg("BARK_STAGE", "stage"),
  };
}

function validateUrlBundle(bundle) {
  const missing = [];
  if (!isValidHttpUrl(bundle.masterUrl)) missing.push("masterUrl");
  if (!isValidHttpUrl(bundle.logUrl)) missing.push("logUrl");
  if (!isValidHttpUrl(bundle.screenUrl)) missing.push("screenUrl");
  if (!bundle.workerVersionId || !/[0-9a-f-]{32,}/i.test(bundle.workerVersionId)) missing.push("workerVersionId");
  if (!bundle.finalStatus) missing.push("finalStatus");
  return missing;
}

const stage = envOrArg("BARK_STAGE", "stage");
const purpose = normalizePurpose(envOrArg("BARK_PURPOSE", "purpose")) || (isFinalStage(stage) ? "final" : "progress");
const result = envOrArg("BARK_RESULT", "result");
const title = envOrArg("BARK_TITLE", "title") || (result === "ng" ? "AIBOUX NG通知" : "AIBOUX 実装完了");
const body = buildBody();
const urlBundle = readUrlBundle();
const urlBundleMissing = validateUrlBundle(urlBundle);
const url = envOrArg("BARK_URL", "url") || urlBundle.logUrl || envOrArg("SHORT_LOG_URL", "short-log-url") || envOrArg("TEMP_LOG_URL", "temp-log-url");
const group = stripControlChars(envOrArg("BARK_GROUP", "group") || defaultGroup);

if (urlBundleMissing.length > 0) {
  jsonLog({
    ok: false,
    delivered: false,
    skipped: true,
    userReceiptConfirmed: false,
    finalGate: false,
    purpose,
    reason: "URL_BUNDLE_REQUIRED_BEFORE_BARK",
    missing: urlBundleMissing,
  });
  process.exit(0);
}

if (purpose === "final" && !isFinalStage(stage)) {
  jsonLog({
    ok: false,
    delivered: false,
    skipped: true,
    userReceiptConfirmed: false,
    finalGate: true,
    purpose,
    reason: "BARK_FINAL_STAGE_REQUIRED",
    stage: stage || "missing",
  });
  process.exit(1);
}

loadBarkSecretEnvIfNeeded();

const enabled = truthy.has((process.env.BARK_ENABLED || "").toLowerCase());
const requiredValue =
  process.env.BARK_REQUIRE_DELIVERY || readArg("required") || readArg("require-delivery") || "";
const requireDelivery = truthy.has(String(requiredValue).toLowerCase());
const confirmReceived = truthy.has(String(readArg("confirm-received") || "").toLowerCase());
const probeAuth = truthy.has(String(readArg("probe-auth") || "").toLowerCase());

if (!enabled) {
  jsonLog({
    ok: false,
    delivered: false,
    skipped: true,
    userReceiptConfirmed: false,
    finalGate: false,
    purpose,
    reason: "BARK_DISABLED",
  });
  process.exit(requireDelivery ? 1 : 0);
}

const endpoint = normalizeEndpoint(process.env.BARK_ENDPOINT);
const deviceKey = extractDeviceKey(process.env.BARK_DEVICE_KEY);

if (!endpoint || !deviceKey || !validDeviceKey(deviceKey)) {
  jsonLog({
    ok: false,
    delivered: false,
    skipped: false,
    userReceiptConfirmed: false,
    finalGate: false,
    purpose,
    reason: !endpoint ? "BARK_ENDPOINT_MISSING" : "BARK_DEVICE_KEY_MISSING_OR_INVALID",
    endpointHost: endpoint ? endpointHost(endpoint) : "missing",
  });
  process.exit(1);
}

const host = endpointHost(endpoint);

try {
  const primaryUrl = `${endpoint.replace(/\/+$/, "")}/push`;
  const primary = await sendJson(primaryUrl, {
    device_key: deviceKey,
    title,
    body,
    url,
    group,
  });

  let selected = primary;
  let mode = "push-json";
  let fallbackReason = "";

  if (!primary.delivered) {
    fallbackReason = responseErrorReason(primary.response, primary.parsed);
    const fallbackUrl = `${endpoint.replace(/\/+$/, "")}/${encodeURIComponent(deviceKey)}`;
    const fallback = await sendJson(fallbackUrl, {
      title,
      body,
      url,
      group,
    });
    selected = fallback;
    mode = "device-path-json";
  }

  let delivered = selected.delivered;
  let userReceiptConfirmed = false;

  if (delivered && confirmReceived) {
    userReceiptConfirmed = false;
  }

  const payload = {
    ok: delivered,
    delivered,
    skipped: false,
    purpose,
    finalGate: false,
    endpointHost: host,
    mode,
    status: selected.response.status,
    responseCode: selected.parsed.json?.code,
    responseMessage: selected.parsed.json?.message,
    responseType: selected.parsed.json ? "json" : selected.parsed.raw || "empty",
    probeAuth,
    userReceiptConfirmed,
    masterUrl: urlBundle.masterUrl,
    logUrl: urlBundle.logUrl,
    screenUrl: urlBundle.screenUrl,
    workerVersionId: urlBundle.workerVersionId,
    finalStatus: urlBundle.finalStatus,
    fallbackReason: mode === "device-path-json" ? fallbackReason : undefined,
    reason: delivered
      ? undefined
      : responseErrorReason(selected.response, selected.parsed),
  };

  jsonLog(payload);
  process.exit(delivered ? 0 : 1);
} catch (error) {
  jsonLog({
    ok: false,
    delivered: false,
    skipped: false,
    userReceiptConfirmed: false,
    finalGate: false,
    purpose,
    reason: "BARK_SEND_FAILED",
    error: error instanceof Error ? error.name : "UnknownError",
    endpointHost: host,
    probeAuth,
  });
  process.exit(1);
}
