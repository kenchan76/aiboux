import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const referencePath = args.get("--reference") ?? "output/reference/core-delivery-detail/reference.png";
const actualPath = args.get("--actual") ?? "output/playwright/core-documents-redesign/delivery-detail-reference-match-v3-1672.png";
const diffPath = args.get("--diff") ?? "output/playwright/core-documents-redesign/delivery-detail-reference-diff-v3-1672.png";
const reportPath = args.get("--report") ?? "output/playwright/core-documents-redesign/delivery-detail-reference-visual-report-v3.json";
const threshold = Number(args.get("--diff-threshold") ?? "0.6");
const pixelDeltaThreshold = Number(args.get("--pixel-delta-threshold") ?? "132");
const rawPixelDeltaThreshold = Number(args.get("--raw-pixel-delta-threshold") ?? "18");

function sanitizeReportText(value) {
  return String(value)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .replace(/\uFFFD/g, "")
    .normalize("NFC");
}

for (const file of [referencePath, actualPath, reportPath]) {
  if (!fs.existsSync(file)) {
    throw new Error(`missing required file: ${file}`);
  }
}

fs.mkdirSync(path.dirname(diffPath), { recursive: true });

const signature = Buffer.from("89504e470d0a1a0a", "hex");
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}
function decodePng(file) {
  const buf = fs.readFileSync(file);
  if (!buf.subarray(0, 8).equals(signature)) throw new Error(`not a PNG: ${file}`);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buf.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }
  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`unsupported PNG format: bitDepth=${bitDepth} colorType=${colorType}`);
  }
  const channels = colorType === 6 ? 4 : 3;
  const stride = width * channels;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(width * height * 4);
  let inOffset = 0;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[inOffset++];
    const row = Buffer.from(raw.subarray(inOffset, inOffset + stride));
    inOffset += stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = prev[x] ?? 0;
      const upLeft = x >= channels ? prev[x - channels] : 0;
      if (filter === 1) row[x] = (row[x] + left) & 0xff;
      else if (filter === 2) row[x] = (row[x] + up) & 0xff;
      else if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) row[x] = (row[x] + paeth(left, up, upLeft)) & 0xff;
      else if (filter !== 0) throw new Error(`unsupported PNG filter: ${filter}`);
    }
    for (let x = 0; x < width; x++) {
      const src = x * channels;
      const dst = (y * width + x) * 4;
      pixels[dst] = row[src];
      pixels[dst + 1] = row[src + 1];
      pixels[dst + 2] = row[src + 2];
      pixels[dst + 3] = channels === 4 ? row[src + 3] : 255;
    }
    prev = row;
  }
  return { width, height, pixels };
}
function nearest(image, x, y) {
  const ix = Math.min(image.width - 1, Math.max(0, Math.round(x)));
  const iy = Math.min(image.height - 1, Math.max(0, Math.round(y)));
  const index = (iy * image.width + ix) * 4;
  return image.pixels.subarray(index, index + 4);
}
function chunk(type, data = Buffer.alloc(0)) {
  const typeBuf = Buffer.from(type, "ascii");
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuf.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 8 + data.length);
  return out;
}
function writePng(file, width, height, pixels) {
  const rows = [];
  for (let y = 0; y < height; y++) {
    rows.push(Buffer.from([0]));
    rows.push(pixels.subarray(y * width * 4, (y + 1) * width * 4));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  fs.writeFileSync(file, Buffer.concat([signature, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))), chunk("IEND")]));
}
const ref = decodePng(referencePath);
const actual = decodePng(actualPath);
const diffPixels = Buffer.alloc(ref.width * ref.height * 4);
let changed = 0;
let rawChanged = 0;
for (let y = 0; y < ref.height; y++) {
  for (let x = 0; x < ref.width; x++) {
    const refIndex = (y * ref.width + x) * 4;
    const actualPixel = nearest(actual, (x / Math.max(1, ref.width - 1)) * Math.max(1, actual.width - 1), (y / Math.max(1, ref.height - 1)) * Math.max(1, actual.height - 1));
    const delta = Math.max(
      Math.abs(ref.pixels[refIndex] - actualPixel[0]),
      Math.abs(ref.pixels[refIndex + 1] - actualPixel[1]),
      Math.abs(ref.pixels[refIndex + 2] - actualPixel[2]),
    );
    if (delta > rawPixelDeltaThreshold) rawChanged += 1;
    if (delta > pixelDeltaThreshold) changed += 1;
    diffPixels[refIndex] = delta > pixelDeltaThreshold ? 255 : 248;
    diffPixels[refIndex + 1] = delta > pixelDeltaThreshold ? Math.max(0, 255 - delta) : 248;
    diffPixels[refIndex + 2] = delta > pixelDeltaThreshold ? Math.max(0, 255 - delta) : 248;
    diffPixels[refIndex + 3] = 255;
  }
}
writePng(diffPath, ref.width, ref.height, diffPixels);
const diffResult = {
  width: ref.width,
  height: ref.height,
  diffRatio: changed / (ref.width * ref.height),
  rawDiffRatio: rawChanged / (ref.width * ref.height),
  pixelDeltaThreshold,
  rawPixelDeltaThreshold,
};
const visualReport = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const visualBlockers = Array.isArray(visualReport.visualBlockers) ? visualReport.visualBlockers : [];
const missingExpectedTexts = Array.isArray(visualReport.missingExpectedTexts) ? visualReport.missingExpectedTexts : [];
const forbiddenTextsFound = Array.isArray(visualReport.forbiddenTextsFound) ? visualReport.forbiddenTextsFound : [];
const geometryPass = visualReport.geometryPass === true;
const textPass = visualReport.textPass === true && missingExpectedTexts.length === 0 && forbiddenTextsFound.length === 0;
const productRow = visualReport.productRow ?? {};
const productRowPass =
  visualReport.productRowPass === true &&
  productRow.productNameSingleLine === true &&
  productRow.productNameSecondLineFound === false &&
  Number(productRow.productNameCellHeight ?? Infinity) <= 24 &&
  Number(productRow.lineRowHeight ?? Infinity) <= 44 &&
  productRow.productNameWhiteSpace === "nowrap";
const fontWeight = visualReport.fontWeight ?? {};
const fontWeightPass =
  visualReport.fontWeightPass === true &&
  fontWeight.verdict === "PASS" &&
  Array.isArray(fontWeight.violations) &&
  fontWeight.violations.length === 0;
const typography = visualReport.typography ?? {};
const typographyPass =
  visualReport.typographyPass === true &&
  typography.verdict === "PASS" &&
  typography.fontSize === "PASS" &&
  typography.lineHeight === "PASS" &&
  typography.fontColor === "PASS" &&
  typography.fontWeight === "PASS" &&
  Array.isArray(typography.violations) &&
  typography.violations.length === 0;
const diffPass = diffResult.diffRatio <= threshold;
const verdict = geometryPass && textPass && productRowPass && fontWeightPass && typographyPass && visualBlockers.length === 0 && diffPass ? "PASS" : "NG";

const output = {
  verdict,
  geometryPass,
  textPass,
  productRowPass,
  fontWeightPass,
  typographyPass,
  diffPass,
  diffRatio: diffResult.diffRatio,
  rawDiffRatio: diffResult.rawDiffRatio,
  diffThreshold: threshold,
  pixelDeltaThreshold: diffResult.pixelDeltaThreshold,
  rawPixelDeltaThreshold: diffResult.rawPixelDeltaThreshold,
  majorRegions: visualReport.geometry ?? null,
  textMismatch: {
    missingExpectedTexts,
    forbiddenTextsFound,
  },
  productRow,
  fontWeight,
  typography,
  visualBlockers,
  diffImage: diffPath,
};

fs.writeFileSync(reportPath, `${sanitizeReportText(JSON.stringify({ ...visualReport, ...output }, null, 2))}\n`, "utf8");
console.log(JSON.stringify(output, null, 2));

if (verdict !== "PASS") {
  process.exit(1);
}
