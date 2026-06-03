export type OfficeFeature = {
  title: string;
  description: string;
  href: string;
  accent: "excel" | "pdf" | "word" | "ppt" | "local" | "security";
  action: string;
};

export type OfficeFormat = {
  extension: string;
  title: string;
  description: string;
  level: string;
  accentClass: string;
};

export type OfficeFaq = {
  question: string;
  answer: string;
};

export const officeNavItems = [
  { label: "Features", href: "/office/#features" },
  { label: "Excel/CSV", href: "/office/excel" },
  { label: "PDF", href: "/office/pdf" },
  { label: "Word", href: "/office/word" },
  { label: "PowerPoint", href: "/office/powerpoint" },
  { label: "Security", href: "/office/security" },
  { label: "Help", href: "/office/help" },
];

export const officeFeatures: OfficeFeature[] = [
  {
    title: "Excel/CSV エディタ",
    description: "CSV、XLSX、XLSMを開き、表形式の確認・軽微修正・ローカル保存へ進めます。",
    href: "/office/excel",
    accent: "excel",
    action: "開く",
  },
  {
    title: "PDF エディタ",
    description: "日付、氏名、金額、署名、白塗り、ページ回転などの軽い修正に集中します。",
    href: "/office/pdf",
    accent: "pdf",
    action: "開く",
  },
  {
    title: "Word クイック編集",
    description: "DOCX文書をブラウザで確認し、テキスト中心の修正とPDF出力に備えます。",
    href: "/office/word",
    accent: "word",
    action: "開く",
  },
  {
    title: "PowerPoint クイックビュー",
    description: "PPTXの文字情報やスライド構成を確認し、簡易生成・確認の導線を提供します。",
    href: "/office/powerpoint",
    accent: "ppt",
    action: "開く",
  },
  {
    title: "ローカル履歴",
    description: "最近開いたファイル名、形式、利用ツールを端末内の履歴として扱う設計です。",
    href: "/office/history",
    accent: "local",
    action: "詳しく見る",
  },
  {
    title: "セキュリティ",
    description: "ファイル本体はサーバーへ送信せず、ブラウザ内で処理する前提を明確にします。",
    href: "/office/security",
    accent: "security",
    action: "詳しく見る",
  },
];

export const supportedFormats: OfficeFormat[] = [
  {
    extension: "CSV",
    title: "カンマ区切り",
    description: "UTF-8 / BOM / Shift_JISの文字化け修正と表編集。",
    level: "編集対応",
    accentClass: "text-emerald-700",
  },
  {
    extension: "XLSX",
    title: "Excel ブック",
    description: "セル値、行列、検索、置換、保存に対応する設計。",
    level: "編集対応",
    accentClass: "text-green-700",
  },
  {
    extension: "XLSM",
    title: "マクロ対応ブック",
    description: "読み込み対象。マクロは安全のため実行しません。",
    level: "マクロ実行なし",
    accentClass: "text-lime-700",
  },
  {
    extension: "DOCX",
    title: "Word 文書",
    description: "テキスト中心のクイック編集とPDF出力導線。",
    level: "簡易編集",
    accentClass: "text-blue-700",
  },
  {
    extension: "PPTX",
    title: "PowerPoint",
    description: "簡易表示、テキスト確認、構成チェックを優先。",
    level: "簡易表示",
    accentClass: "text-orange-700",
  },
  {
    extension: "PDF",
    title: "PDF 文書",
    description: "文字修正、署名、白塗り、ページ操作に対応する設計。",
    level: "直接編集",
    accentClass: "text-red-700",
  },
];

export const mainOfficeFeatures = [
  "CSV文字化け修正",
  "セル値の軽微修正",
  "PDF文字編集",
  "PDF署名追加",
  "ローカル保存",
  "添付名の確認",
  "PDFページ削除",
  "PDFページ回転",
  "検索と置換",
  "無料会員登録で履歴化",
];

export const officeFaqs: OfficeFaq[] = [
  {
    question: "開いたファイルはサーバーに送信されますか？",
    answer:
      "いいえ。Aiboux Officeは、ファイル本体をブラウザ内で処理する設計です。広告表示やページ表示に必要な通信は発生しますが、開いたファイル本体は原則としてサーバーへ送信されません。",
  },
  {
    question: "Microsoft Officeと完全互換ですか？",
    answer:
      "完全互換を保証するサービスではありません。日付、金額、本文の軽微修正、CSVの文字化け修正、PDFへの追記など、ブラウザで素早く済ませたい作業に集中したミニマルOfficeツールです。",
  },
  {
    question: "XLSMのマクロは実行されますか？",
    answer:
      "実行されません。XLSMファイルを読み込む場合も、マクロは安全のため実行しない前提で扱います。",
  },
  {
    question: "30秒後の広告は編集を止めますか？",
    answer:
      "止めません。表示される場合も、画面右下または下部の小さな非モーダル枠に一度だけ表示され、閉じられます。保存やダウンロードの条件にはしません。",
  },
  {
    question: "保存はどう行いますか？",
    answer:
      "対応ブラウザではファイル保存ダイアログを使い、非対応環境ではBlobダウンロードにフォールバックします。編集結果は端末に保存されます。",
  },
];

export const ecosystemCards = [
  {
    name: "aiboux FILE",
    href: "/file",
    description: "ファイル転送、PDF、画像、バーコード作成をまとめて扱う無料ファイルツール。",
  },
  {
    name: "aiboux BIZ",
    href: "/biz",
    description: "見積書、請求書、契約書などのテンプレート編集と文書管理。",
  },
  {
    name: "aiboux 履歴書",
    href: "/rirekisho",
    description: "履歴書、職務経歴書、証明写真、求人票解析をスマホで完結。",
  },
];

export const officeSeo = {
  site: "https://office.aiboux.com",
  title: "Aiboux Office | ブラウザだけでOffice・PDFをサクッと編集",
  description:
    "Aiboux Officeは、Word、Excel、PowerPoint、PDF、CSVをスマホやPCのブラウザで開いて、サーバーに送信せずに軽く編集・保存できる無料のミニマルOfficeツールです。",
};
