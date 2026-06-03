import type { OfficeFileKind } from "../file-detect";

export function runtimeSummary(kind: Extract<OfficeFileKind, "xlsx" | "xlsm">) {
  return {
    kind,
    label: kind === "xlsm" ? "XLSMローカル確認" : "XLSXローカルエディタ",
    heavyLibraryPolicy:
      "SheetJS / ExcelJS等の重量ライブラリは、ファイル選択後の専用チャンクとして読み込む設計です。XLSMマクロは実行しません。",
  };
}
