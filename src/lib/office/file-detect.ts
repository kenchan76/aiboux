export type OfficeFileKind = "csv" | "xlsx" | "xlsm" | "docx" | "pptx" | "pdf" | "unknown";

export function detectOfficeFileKind(fileName: string): OfficeFileKind {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "csv" || extension === "txt") return "csv";
  if (extension === "xlsx") return "xlsx";
  if (extension === "xlsm") return "xlsm";
  if (extension === "docx") return "docx";
  if (extension === "pptx") return "pptx";
  if (extension === "pdf") return "pdf";
  return "unknown";
}
