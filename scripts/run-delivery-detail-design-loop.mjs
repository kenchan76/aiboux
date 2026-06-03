import fs from "node:fs";
import path from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const comparePath =
  args.get("--compare") ??
  "output/playwright/core-documents-redesign/delivery-detail-reference-compare-v79.json";
const threshold = Number(args.get("--threshold") ?? "0.04");
const logPath =
  args.get("--log") ??
  "all_log/internal/core_delivery_detail_design_loop_iterations.md";
const iteration = args.get("--iteration") ?? "manual";

function sanitizeReportText(value) {
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\uFFFD/g, "")
    .normalize("NFC");
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

if (!fs.existsSync(comparePath)) {
  console.error(`DESIGN_LOOP_HARD_BLOCKED missing compare JSON: ${comparePath}`);
  process.exit(3);
}

const report = JSON.parse(fs.readFileSync(comparePath, "utf8"));
const missingExpectedTexts = asArray(report.missingExpectedTexts ?? report.textMismatch?.missingExpectedTexts);
const forbiddenTextsFound = asArray(report.forbiddenTextsFound ?? report.textMismatch?.forbiddenTextsFound);
const visualBlockers = asArray(report.visualBlockers);
const typographyViolations = asArray(report.typography?.violations);
const diffRatio = Number(report.diffRatio ?? Infinity);
const geometryPass = report.geometryPass === true || report.geometry?.verdict === "PASS";
const productNameSingleLine = report.productRow?.productNameSingleLine === true;

const failures = [];
if (!(diffRatio <= threshold)) failures.push(`diffRatio ${diffRatio} > ${threshold}`);
if (missingExpectedTexts.length) failures.push(`missingExpectedTexts ${missingExpectedTexts.length}`);
if (forbiddenTextsFound.length) failures.push(`forbiddenTextsFound ${forbiddenTextsFound.length}`);
if (visualBlockers.length) failures.push(`visualBlockers ${visualBlockers.length}`);
if (typographyViolations.length) failures.push(`typographyViolations ${typographyViolations.length}`);
if (!geometryPass) failures.push("geometryPass false");
if (!productNameSingleLine) failures.push("productNameSingleLine false");

fs.mkdirSync(path.dirname(logPath), { recursive: true });
const trendLine = [
  `## Iteration ${iteration}`,
  `- comparePath: ${comparePath}`,
  `- diffRatio: ${Number.isFinite(diffRatio) ? diffRatio : "missing"}`,
  `- threshold: ${threshold}`,
  `- missingExpectedTexts: ${missingExpectedTexts.length}`,
  `- forbiddenTextsFound: ${forbiddenTextsFound.length}`,
  `- typographyViolations: ${typographyViolations.length}`,
  `- visualBlockers: ${visualBlockers.length}`,
  `- geometryPass: ${geometryPass}`,
  `- productNameSingleLine: ${productNameSingleLine}`,
  `- verdict: ${failures.length ? "CONTINUE" : "PASS"}`,
  failures.length ? `- failures: ${failures.join("; ")}` : "- failures: none",
  "",
].join("\n");
fs.appendFileSync(logPath, sanitizeReportText(trendLine), "utf8");

if (failures.length) {
  console.error("DESIGN_LOOP_CONTINUE");
  console.error(failures.join("\n"));
  process.exit(2);
}

console.log("DESIGN_LOOP_PASS");
