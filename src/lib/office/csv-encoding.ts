export function stripUtf8Bom(text: string) {
  return text.replace(/^\uFEFF/, "");
}

export function parseSimpleCsv(text: string) {
  return stripUtf8Bom(text)
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function normalizeCsvLineEndings(text: string) {
  return stripUtf8Bom(text).replace(/\r?\n/g, "\r\n");
}
