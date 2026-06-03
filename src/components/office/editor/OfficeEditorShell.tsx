import { useMemo, useState } from "react";
import { parseSimpleCsv } from "@/lib/office/csv-encoding";
import { loadOfficeRuntime } from "@/lib/office/dynamic-imports";
import { detectOfficeFileKind, type OfficeFileKind } from "@/lib/office/file-detect";
import { saveTextFile } from "@/lib/office/save-file";

type LoadedFile = {
  file: File;
  kind: OfficeFileKind;
  text: string;
  rows: string[][];
  runtimeLabel: string;
  runtimePolicy: string;
};

export default function OfficeEditorShell() {
  const [loadedFile, setLoadedFile] = useState<LoadedFile | null>(null);
  const [status, setStatus] = useState("ファイル本体はサーバーへ送信されません。端末内で読み込みます。");
  const [csvText, setCsvText] = useState("");

  const previewRows = useMemo(() => parseSimpleCsv(csvText).slice(0, 8), [csvText]);

  async function handleFile(file: File) {
    const kind = detectOfficeFileKind(file.name);
    const runtime = await loadOfficeRuntime(kind);
    setStatus(`${file.name} をブラウザ内で判定しました。種別: ${kind.toUpperCase()}`);

    if (kind === "csv") {
      const text = await file.text();
      const rows = parseSimpleCsv(text);
      setCsvText(text);
      setLoadedFile({ file, kind, text, rows, runtimeLabel: runtime.label, runtimePolicy: runtime.heavyLibraryPolicy });
      setStatus("CSVを端末内で読み込みました。編集後はBlobとしてローカル保存できます。");
      return;
    }

    await file.arrayBuffer();
    setLoadedFile({ file, kind, text: "", rows: [], runtimeLabel: runtime.label, runtimePolicy: runtime.heavyLibraryPolicy });
    setStatus(`${kind.toUpperCase()}はファイル本体を端末内で読み込みました。専用エディタはファイル選択後に遅延読み込みする設計です。`);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-5 lg:grid-cols-[1fr_340px] lg:px-6">
      <section className="min-h-[68vh] rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50 px-3 py-2">
          <div>
            <p className="text-sm font-semibold text-neutral-950">Aiboux Office Editor</p>
            <p className="text-xs text-neutral-500">{status}</p>
          </div>
          <div className="flex gap-2">
            {loadedFile?.kind === "csv" && (
              <button
                type="button"
                onClick={() => void saveTextFile(loadedFile.file.name.replace(/\.[^.]+$/, "") + "_edited.csv", csvText, "text/csv;charset=utf-8")}
                className="rounded-md border border-yellow-400 bg-yellow-300 px-3 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              >
                CSVを保存
              </button>
            )}
            <label className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-100">
              ファイルを選択
              <input
                type="file"
                className="sr-only"
                accept=".csv,.xlsx,.xlsm,.docx,.pptx,.pdf,text/csv,application/pdf"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
            </label>
          </div>
        </div>

        {!loadedFile ? (
          <div className="flex min-h-[52vh] items-center justify-center p-4">
            <label className="w-full max-w-2xl cursor-pointer rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center hover:border-yellow-400 hover:bg-yellow-50">
              <input
                type="file"
                className="sr-only"
                accept=".csv,.xlsx,.xlsm,.docx,.pptx,.pdf,text/csv,application/pdf"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
              <p className="text-lg font-semibold text-neutral-950">ここにOffice/PDF/CSVファイルを選択</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                選択されたファイル本体はサーバーへ送信されません。CSVはこの画面で編集と保存を確認できます。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-semibold text-neutral-700">
                {["CSV", "XLSX", "XLSM", "DOCX", "PPTX", "PDF"].map((item) => (
                  <span className="rounded border border-neutral-200 bg-white px-2 py-1" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </label>
          </div>
        ) : loadedFile.kind === "csv" ? (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_1fr]">
            <div>
              <label htmlFor="csv-editor" className="text-sm font-semibold text-neutral-950">
                CSVテキスト
              </label>
              <textarea
                id="csv-editor"
                value={csvText}
                onChange={(event) => setCsvText(event.currentTarget.value)}
                className="mt-2 h-[460px] w-full resize-none rounded-lg border border-neutral-200 bg-white p-3 text-xs leading-5 text-neutral-900 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-200"
              />
            </div>
            <div className="overflow-hidden rounded-lg border border-neutral-200">
              <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-semibold text-neutral-950">プレビュー</div>
              <div className="overflow-auto">
                <table className="min-w-full border-collapse text-xs">
                  <tbody>
                    {previewRows.map((row, rowIndex) => (
                      <tr key={`row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${rowIndex}-${cellIndex}`} className="max-w-48 truncate border-b border-r border-neutral-100 px-2 py-1.5 text-neutral-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_320px]">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5">
              <p className="text-sm font-semibold text-neutral-950">{loadedFile.file.name}</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {loadedFile.kind.toUpperCase()}の専用編集UIは、ファイル選択後に種別ごとのチャンクとして読み込む設計です。現段階でもファイル本体はサーバーへ送信していません。
              </p>
              <div className="mt-4 grid gap-2 text-sm text-neutral-700">
                <div className="rounded border border-neutral-200 bg-white px-3 py-2">ランタイム: {loadedFile.runtimeLabel}</div>
                <div className="rounded border border-neutral-200 bg-white px-3 py-2">サイズ: {(loadedFile.file.size / 1024).toFixed(1)} KB</div>
                <div className="rounded border border-neutral-200 bg-white px-3 py-2">処理場所: ブラウザ内</div>
                <div className="rounded border border-neutral-200 bg-white px-3 py-2">サーバー送信: なし</div>
              </div>
              <p className="mt-4 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs leading-5 text-neutral-600">{loadedFile.runtimePolicy}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-950">互換性に関する注意</p>
              <p className="mt-2 text-xs leading-5 text-amber-900">
                Office/PDFはファイル構造により表示・編集結果が異なる場合があります。複雑な書式やマクロ実行、完全互換は対象外です。
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-neutral-950">ローカル処理ガイド</p>
        <div className="mt-3 grid gap-2 text-sm text-neutral-700">
          <div className="rounded border border-neutral-200 bg-neutral-50 p-3">1. ファイルを選択</div>
          <div className="rounded border border-neutral-200 bg-neutral-50 p-3">2. ブラウザ内で内容を確認</div>
          <div className="rounded border border-neutral-200 bg-neutral-50 p-3">3. 必要な部分だけ修正</div>
          <div className="rounded border border-neutral-200 bg-neutral-50 p-3">4. Blobとして端末へ保存</div>
        </div>
        <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs leading-5 text-neutral-700">
          広告表示やページ表示に必要な通信は発生しますが、開いたファイル本体は送信されません。
        </div>
      </aside>
    </div>
  );
}
