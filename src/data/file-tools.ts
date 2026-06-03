export type FileTool = {
  slug: string;
  category: "transfer" | "pdf" | "image" | "barcode" | "history";
  title: string;
  description: string;
  href: string;
  badge?: string;
};

export type FileToolCategory = {
  title: string;
  description: string;
  href: string;
  tools: string;
};

export type FileUseCase = {
  title: string;
  description: string;
  metric: string;
};

export const toolCategories: FileToolCategory[] = [
  {
    title: "PDF",
    description: "結合、圧縮、分割、回転をブラウザで整理。",
    href: "/file/pdf",
    tools: "7 tools",
  },
  {
    title: "画像",
    description: "圧縮、リサイズ、WebP変換、商品写真の整形。",
    href: "/file/image",
    tools: "6 tools",
  },
  {
    title: "背景透過",
    description: "商品写真を白背景や透明PNGに整える作業導線。",
    href: "/file/image/background-remover",
    tools: "3 modes",
  },
  {
    title: "バーコード",
    description: "QR、JAN、ITF、Code128を業務用途で作成。",
    href: "/file/barcode",
    tools: "4 formats",
  },
  {
    title: "ファイル転送",
    description: "メール送信と共有リンクを1画面で切り替え。",
    href: "/file/transfer",
    tools: "5GB",
  },
  {
    title: "履歴管理",
    description: "送受信、変換、共有リンクをPlus Liteで一元管理。",
    href: "/file/dashboard",
    tools: "Plus Lite",
  },
];

export const fileTools: FileTool[] = [
  {
    slug: "transfer",
    category: "transfer",
    title: "ファイル転送",
    description: "大容量ファイルをメールまたはリンクで共有。相手は登録不要です。",
    href: "/file/transfer",
    badge: "最大5GB",
  },
  {
    slug: "password-share",
    category: "transfer",
    title: "パスワード付き共有",
    description: "保存期間、パスワード、メッセージをまとめて設定できます。",
    href: "/file/transfer",
  },
  {
    slug: "pdf-merge",
    category: "pdf",
    title: "PDF結合",
    description: "複数の契約書や見積書を1つのPDFにまとめる導線です。",
    href: "/file/pdf",
  },
  {
    slug: "pdf-compress",
    category: "pdf",
    title: "PDF圧縮",
    description: "メール添付しやすいサイズへ、送る前に軽く整えます。",
    href: "/file/pdf",
    badge: "人気",
  },
  {
    slug: "pdf-split",
    category: "pdf",
    title: "PDF分割",
    description: "ページ単位で請求書、納品書、資料を切り分けます。",
    href: "/file/pdf",
  },
  {
    slug: "pdf-rotate",
    category: "pdf",
    title: "PDF回転",
    description: "スキャン方向がずれたPDFを、画面上で確認しながら修正します。",
    href: "/file/pdf",
  },
  {
    slug: "image-compress",
    category: "image",
    title: "画像圧縮",
    description: "商品写真や現場写真を共有しやすい容量に圧縮します。",
    href: "/file/image",
  },
  {
    slug: "image-resize",
    category: "image",
    title: "画像リサイズ",
    description: "EC、資料、メール添付向けに幅と高さをそろえます。",
    href: "/file/image",
  },
  {
    slug: "background-remover",
    category: "image",
    title: "背景透過",
    description: "商品写真を透明PNG、白背景、WebPへ整える作業画面です。",
    href: "/file/image/background-remover",
    badge: "商品写真",
  },
  {
    slug: "webp",
    category: "image",
    title: "WebP変換",
    description: "Web掲載用の軽量画像に変換し、表示速度を改善します。",
    href: "/file/image",
  },
  {
    slug: "qr",
    category: "barcode",
    title: "QRコード作成",
    description: "URL、連絡先、共有リンクをすぐ読み取れるコードにします。",
    href: "/file/barcode",
  },
  {
    slug: "barcode",
    category: "barcode",
    title: "JAN/ITFバーコード",
    description: "商品ラベル、ケースラベル、出荷現場向けのバーコードを作成します。",
    href: "/file/barcode",
  },
];

export const selectionReasons = [
  {
    title: "高速アップロード",
    description: "大容量ファイルも、送信方法を選んでそのまま投げ込める構造です。",
  },
  {
    title: "シンプルな共有",
    description: "メールで送る、リンクを作る。受け取り側の登録は不要です。",
  },
  {
    title: "安全なダウンロード",
    description: "パスワード、保存期限、削除設定を同じ画面で扱える設計です。",
  },
  {
    title: "履歴管理",
    description: "Plus Liteでは送信、受信、変換、再共有まで1つの履歴に集約します。",
  },
  {
    title: "PDF/画像も処理",
    description: "送る前の圧縮、結合、変換、背景透過を同じサービスで完結します。",
  },
  {
    title: "業務バーコード",
    description: "JAN、ITF、QR、Code128を商品や出荷作業に合わせて作れます。",
  },
];

export const useCases: FileUseCase[] = [
  {
    title: "クリエイター・デザイナー",
    description: "制作データ、確認用PDF、画像素材をまとめて送付。",
    metric: "素材共有",
  },
  {
    title: "ビジネスユーザー",
    description: "契約書、見積書、会議資料を登録不要で共有。",
    metric: "社外送付",
  },
  {
    title: "EC・ショップ運営者",
    description: "商品画像、仕様書、バーコードを販売準備に活用。",
    metric: "商品準備",
  },
  {
    title: "総務・バックオフィス",
    description: "社内外のPDF、CSV、画像を整理しながら転送。",
    metric: "日次業務",
  },
  {
    title: "士業・契約書送付",
    description: "契約書、本人確認書類、控え資料を期限付きで共有。",
    metric: "安全共有",
  },
  {
    title: "卸・商品マスタ運用",
    description: "JAN、ITF、商品写真、仕様書の受け渡しを1画面化。",
    metric: "商品連携",
  },
];
