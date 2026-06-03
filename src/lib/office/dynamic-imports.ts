import type { OfficeFileKind } from "./file-detect";

export type OfficeRuntimeSummary = {
  kind: OfficeFileKind;
  label: string;
  heavyLibraryPolicy: string;
};

export async function loadOfficeRuntime(kind: OfficeFileKind): Promise<OfficeRuntimeSummary> {
  if (kind === "csv") return import("./runtime/csv-runtime").then((mod) => mod.runtimeSummary);
  if (kind === "xlsx" || kind === "xlsm") return import("./runtime/spreadsheet-runtime").then((mod) => mod.runtimeSummary(kind));
  if (kind === "pdf") return import("./runtime/pdf-runtime").then((mod) => mod.runtimeSummary);
  if (kind === "docx") return import("./runtime/docx-runtime").then((mod) => mod.runtimeSummary);
  if (kind === "pptx") return import("./runtime/pptx-runtime").then((mod) => mod.runtimeSummary);
  return {
    kind: "unknown",
    label: "未対応形式",
    heavyLibraryPolicy: "ファイル形式を判定できないため、専用ランタイムは読み込みません。",
  };
}
