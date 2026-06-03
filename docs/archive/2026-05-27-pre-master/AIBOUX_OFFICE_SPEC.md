# AIBOUX Office Spec

Aiboux Office は、アプリ不要・サーバー送信なし・ブラウザだけでOffice/PDF/CSVを軽く編集するミニマルOfficeツールです。

## Confirmed Decisions

- Service name: Aiboux Office。
- URL: `https://office.aiboux.com`
- 左上: `aiboux OFFICE`
- OFFICE badge と主要CTAは黄色系。
- 黄色ボタンの文字は黒。
- Astro 6 + Starwind UI + Tailwind CSS v4。
- React Islands for editor/dropzone。
- shadcn/ui禁止。
- Light mode only。
- ファイル本体は原則サーバーへ送信しない。
- TOPとサービスサイトにAdSense枠。
- 無料利用時、30秒後に一度だけフローティングAdSense枠。ただしAdSenseポリシー順守。
- Microsoft / Google / Adobe等とは無関係である旨を明記する。

## Assumptions

- LPはAstro静的HTML中心。
- ファイル選択後に拡張子とMIMEを判定し、必要なEditor chunkをdynamic importする。
- IndexedDBでローカル履歴を管理する。
- 無料会員登録では履歴メタデータ中心に保存する。

## TBD

- 実採用するOffice/PDFライブラリ。
- 無料会員登録後の履歴保存範囲。
- クライアント側暗号化保存の有無。
- Officeの有料プラン有無。

## Do Not Invent

- Officeファイル本体を勝手にサーバーへ送信しない。
- PDF/Office完全互換を謳わない。
- マクロを実行しない。
- AdSenseを保存/ダウンロードボタン付近に置かない。
- 広告を見るまで保存できない強制制御を入れない。
- 黄色ボタンに白文字を使わない。

## Concept

「アプリ不要。サーバー送信なし。ブラウザだけでOfficeファイルをサクッと編集。」

対応予定:

- CSV
- XLSX
- XLSM
- DOCX
- PPTX
- PDF

## Technical Direction

- File API
- ArrayBuffer
- Blob download
- IndexedDB
- Web Workers
- Dynamic import
- DOMPurify for HTML sanitize

候補ライブラリ:

- CSV/XLSX: SheetJS xlsx
- Excel拡張: ExcelJS
- PDF表示: PDF.js
- PDF直接編集/保存: pdf-lib
- DOCX表示: docx-preview / mammoth.js
- DOCX生成: docx
- PPTX生成/簡易出力: PptxGenJS

## PDF Editing Scope

### Text Replace Mode

- PDF.jsでページをレンダリング。
- textLayer / getTextContentで座標取得。
- クリック領域を重ねる。
- 白塗りまたは近似背景で既存文字を消す。
- pdf-libで同座標に修正後テキストを描画。

制限:

- フォント完全一致は保証しない。
- 複雑背景では消し込み跡が残る場合がある。
- スキャンPDF/画像PDFは直接文字編集不可。

### Form Fill Mode

- テキストフィールド。
- チェックボックス。
- ラジオ。
- ドロップダウン。
- flatten保存。

### Overlay Edit Mode

- テキスト追加。
- 白塗り。
- 署名。
- 印影風スタンプ。
- チェック。
- 日付。
- 画像挿入。
- ページ回転/削除/並び替え。

## Excel / CSV Scope

- CSV読み込み。
- XLSX読み込み。
- XLSM読み込み。
- セル値編集。
- 行/列追加削除。
- 検索置換。
- ソート。
- フィルター。
- CSV保存。
- XLSX保存。
- Shift_JIS / UTF-8 / UTF-8 BOM 文字化け修正。
- XLSMマクロ実行禁止。

## DOCX / PPTX Scope

DOCX:

- 表示。
- テキスト中心のクイック編集。
- 検索置換。
- PDF出力候補。
- 完全互換は対象外。

PPTX:

- 簡易表示。
- テキスト抽出。
- 簡易生成。
- 完全編集は初期対象外。

## AdSense Rules

- 30秒後に1回だけ表示。
- 1セッション1回。
- localStorage/sessionStorageで表示済み管理。
- 非モーダル。
- 閉じるボタンあり。
- フォーカスを奪わない。
- 自動更新しない。
- 偽ダウンロード風デザイン禁止。

## Pages

- `/`
- `/editor`
- `/excel`
- `/csv`
- `/pdf`
- `/word`
- `/powerpoint`
- `/security`
- `/history`
- `/help`
- `/terms`
- `/privacy`
- `/disclaimer`
