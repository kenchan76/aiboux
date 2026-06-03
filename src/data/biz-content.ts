export interface BizCategory {
  slug: string;
  title: string;
  countLabel: string;
  description: string;
  href: string;
}

export interface BizTemplate {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  description: string;
  formats: string[];
  isFree: boolean;
  isPopular: boolean;
  updatedAt: string;
  tags: string[];
  editableFields: string[];
}

export interface BizFaq {
  question: string;
  answer: string;
}

export interface BizDashboardRow {
  title: string;
  category: string;
  updatedAt: string;
  formats: string;
  status: string;
}

export const bizCategories: BizCategory[] = [
  { slug: "contracts", title: "契約書・法務", countLabel: "順次追加中", description: "業務委託、秘密保持、雇用契約などの基本書式。", href: "/biz/templates/contracts" },
  { slug: "invoices", title: "請求書・見積書", countLabel: "定番", description: "インボイス対応の請求書、見積書、領収書。", href: "/biz/templates/invoices" },
  { slug: "proposals", title: "企画書・提案書", countLabel: "営業向け", description: "提案の骨子、比較表、導入効果をまとめる文書。", href: "/biz/templates/proposals" },
  { slug: "reports", title: "報告書・議事録", countLabel: "社内共有", description: "業務報告、会議メモ、週報、月報のテンプレート。", href: "/biz/templates/reports" },
  { slug: "hr", title: "人事・労務", countLabel: "管理部門", description: "雇用、退職、勤怠、面談記録などの書式。", href: "/biz/templates/hr" },
  { slug: "accounting", title: "経理・会計", countLabel: "バックオフィス", description: "経費精算、支払依頼、入金確認、台帳管理。", href: "/biz/templates/accounting" },
  { slug: "sales", title: "営業・販促", countLabel: "商談支援", description: "営業日報、顧客管理、販促計画の文書。", href: "/biz/templates" },
  { slug: "manuals", title: "マニュアル・業務", countLabel: "標準化", description: "手順書、チェックリスト、業務引き継ぎ資料。", href: "/biz/templates" },
  { slug: "other", title: "その他ビジネス文書", countLabel: "汎用", description: "稟議書、届出、社内共有に使う文書。", href: "/biz/templates" },
];

export const bizTemplates: BizTemplate[] = [
  {
    slug: "simple-estimate",
    title: "見積書（シンプル）",
    category: "invoices",
    categoryLabel: "請求書・見積書",
    description: "品目、数量、単価、消費税、合計金額をすばやく整えられる標準的な見積書です。",
    formats: ["Webエディタ", "PDF", "Excel"],
    isFree: true,
    isPopular: true,
    updatedAt: "2026/05/20",
    tags: ["見積", "営業", "即日作成"],
    editableFields: ["会社名", "宛名", "見積番号", "品目", "数量", "単価", "有効期限"],
  },
  {
    slug: "invoice-qualified",
    title: "請求書（インボイス対応）",
    category: "invoices",
    categoryLabel: "請求書・見積書",
    description: "登録番号、税率別内訳、支払期限を含めた実務向け請求書テンプレートです。",
    formats: ["Webエディタ", "PDF", "Excel"],
    isFree: true,
    isPopular: true,
    updatedAt: "2026/05/18",
    tags: ["請求", "インボイス", "経理"],
    editableFields: ["請求先", "登録番号", "請求日", "支払期限", "明細", "振込先"],
  },
  {
    slug: "outsourcing-contract",
    title: "業務委託契約書",
    category: "contracts",
    categoryLabel: "契約書・法務",
    description: "委託業務の範囲、報酬、納品、秘密保持、契約期間を整理した契約書です。",
    formats: ["Webエディタ", "Word", "PDF"],
    isFree: false,
    isPopular: true,
    updatedAt: "2026/05/15",
    tags: ["契約", "外注", "法務"],
    editableFields: ["委託者", "受託者", "業務内容", "報酬", "契約期間", "成果物"],
  },
  {
    slug: "nda-basic",
    title: "秘密保持契約書",
    category: "contracts",
    categoryLabel: "契約書・法務",
    description: "商談や共同検討の開始時に使いやすい、相互秘密保持の基本書式です。",
    formats: ["Webエディタ", "Word", "PDF"],
    isFree: true,
    isPopular: true,
    updatedAt: "2026/05/12",
    tags: ["NDA", "商談", "機密"],
    editableFields: ["開示者", "受領者", "目的", "有効期間", "返却条件"],
  },
  {
    slug: "employment-contract",
    title: "雇用契約書",
    category: "hr",
    categoryLabel: "人事・労務",
    description: "雇用期間、就業場所、勤務時間、賃金、休日をまとめる労務向け文書です。",
    formats: ["Webエディタ", "Word", "PDF"],
    isFree: false,
    isPopular: true,
    updatedAt: "2026/05/10",
    tags: ["雇用", "労務", "人事"],
    editableFields: ["従業員名", "雇用期間", "賃金", "勤務時間", "休日", "就業場所"],
  },
  {
    slug: "resignation-letter",
    title: "退職届",
    category: "hr",
    categoryLabel: "人事・労務",
    description: "退職日と提出日を差し替えて使える、簡潔な退職届テンプレートです。",
    formats: ["Webエディタ", "PDF", "Word"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/05/09",
    tags: ["退職", "届出", "人事"],
    editableFields: ["氏名", "退職日", "提出日", "宛名"],
  },
  {
    slug: "meeting-minutes",
    title: "議事録テンプレート",
    category: "reports",
    categoryLabel: "報告書・議事録",
    description: "参加者、議題、決定事項、宿題を1枚に整理する会議記録テンプレートです。",
    formats: ["Webエディタ", "Word", "PDF"],
    isFree: true,
    isPopular: true,
    updatedAt: "2026/05/07",
    tags: ["会議", "議事録", "共有"],
    editableFields: ["会議名", "日時", "参加者", "議題", "決定事項", "担当者"],
  },
  {
    slug: "business-report",
    title: "業務報告書",
    category: "reports",
    categoryLabel: "報告書・議事録",
    description: "週次・月次の活動、課題、次回予定を高密度にまとめる報告書です。",
    formats: ["Webエディタ", "PDF", "Word"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/05/05",
    tags: ["報告", "週報", "月報"],
    editableFields: ["部署", "担当者", "期間", "報告内容", "課題", "次回予定"],
  },
  {
    slug: "sales-proposal",
    title: "提案書テンプレート",
    category: "proposals",
    categoryLabel: "企画書・提案書",
    description: "課題、提案内容、導入効果、見積を整理する営業提案向けテンプレートです。",
    formats: ["Webエディタ", "PowerPoint", "PDF"],
    isFree: false,
    isPopular: true,
    updatedAt: "2026/05/04",
    tags: ["提案", "営業", "企画"],
    editableFields: ["顧客名", "課題", "提案概要", "効果", "費用", "スケジュール"],
  },
  {
    slug: "planning-sheet",
    title: "企画書",
    category: "proposals",
    categoryLabel: "企画書・提案書",
    description: "目的、背景、施策、KPI、体制、予算を整理する企画書テンプレートです。",
    formats: ["Webエディタ", "PowerPoint", "PDF"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/05/01",
    tags: ["企画", "KPI", "施策"],
    editableFields: ["企画名", "目的", "背景", "施策", "KPI", "予算"],
  },
  {
    slug: "approval-request",
    title: "稟議書",
    category: "accounting",
    categoryLabel: "経理・会計",
    description: "申請理由、金額、支払先、承認欄をまとめる社内申請文書です。",
    formats: ["Webエディタ", "PDF", "Excel"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/28",
    tags: ["稟議", "承認", "支払"],
    editableFields: ["申請者", "件名", "金額", "理由", "承認者", "添付資料"],
  },
  {
    slug: "expense-report",
    title: "経費精算書",
    category: "accounting",
    categoryLabel: "経理・会計",
    description: "日付、用途、金額、領収書有無を一覧化する精算用テンプレートです。",
    formats: ["Webエディタ", "Excel", "PDF"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/25",
    tags: ["経費", "精算", "会計"],
    editableFields: ["申請者", "利用日", "用途", "金額", "領収書", "承認欄"],
  },
  {
    slug: "customer-list",
    title: "顧客管理表",
    category: "sales",
    categoryLabel: "営業・販促",
    description: "顧客名、担当者、連絡先、商談状況を整理する営業管理表です。",
    formats: ["Webエディタ", "Excel"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/22",
    tags: ["顧客", "営業", "管理表"],
    editableFields: ["顧客名", "担当者", "メール", "電話", "ステータス", "次回予定"],
  },
  {
    slug: "inventory-sheet",
    title: "在庫管理表",
    category: "accounting",
    categoryLabel: "経理・会計",
    description: "SKU、現在庫、適正在庫、入出庫予定を確認する表形式テンプレートです。",
    formats: ["Webエディタ", "Excel"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/19",
    tags: ["在庫", "SKU", "管理表"],
    editableFields: ["SKU", "商品名", "現在庫", "入庫予定", "出庫予定", "棚卸日"],
  },
  {
    slug: "purchase-order",
    title: "発注書",
    category: "invoices",
    categoryLabel: "請求書・見積書",
    description: "仕入先、納期、品目、数量、単価を整えた発注書テンプレートです。",
    formats: ["Webエディタ", "PDF", "Excel"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/16",
    tags: ["発注", "仕入", "購買"],
    editableFields: ["仕入先", "発注日", "納期", "品目", "数量", "単価"],
  },
  {
    slug: "delivery-note",
    title: "納品書",
    category: "invoices",
    categoryLabel: "請求書・見積書",
    description: "納品日、納品先、品目、数量を明確に残せる納品書テンプレートです。",
    formats: ["Webエディタ", "PDF", "Excel"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/14",
    tags: ["納品", "出荷", "帳票"],
    editableFields: ["納品先", "納品日", "品目", "数量", "担当者", "備考"],
  },
  {
    slug: "receipt-basic",
    title: "領収書",
    category: "accounting",
    categoryLabel: "経理・会計",
    description: "宛名、金額、但し書き、発行者情報を入れて作成できる領収書です。",
    formats: ["Webエディタ", "PDF"],
    isFree: true,
    isPopular: false,
    updatedAt: "2026/04/11",
    tags: ["領収書", "会計", "支払"],
    editableFields: ["宛名", "金額", "但し書き", "発行日", "発行者"],
  },
];

export const bizFeatureCards = [
  { title: "豊富なテンプレート", description: "契約書・請求書・社内文書をカテゴリ別に整理。" },
  { title: "Webエディタ搭載", description: "文字や項目をブラウザ上で編集できます。" },
  { title: "会員なら履歴保存", description: "作成中・ダウンロード済み文書を履歴管理。" },
  { title: "商用利用OK", description: "個人・法人を問わず業務で使いやすい設計。" },
  { title: "幅広い形式で出力", description: "PDF / Word / Excel / PowerPointなどに対応予定。" },
  { title: "安心のセキュリティ", description: "通信、保存、ダウンロードを安全に扱う導線。" },
];

export const bizUseCases = [
  { title: "中小企業の営業・事務", description: "見積書や請求書、契約書の作成を効率化。", label: "営業" },
  { title: "フリーランス・個人事業主", description: "提案書や契約書をその日必要な形ですぐに作成。", label: "個人事業" },
  { title: "バックオフィス・総務", description: "各種届出や申請書、社内書式を統一して管理。", label: "総務" },
  { title: "士業・コンサルタント", description: "契約書や報告書を信頼感のある文書で作成。", label: "専門職" },
  { title: "スタートアップ・ベンチャー", description: "ドキュメント整備でビジネスの基盤を強化。", label: "成長企業" },
  { title: "EC・ネットショップ運営", description: "利用規約や納品書などの書式を簡単に作成。", label: "EC" },
];

export const bizPricingPlans = [
  {
    name: "無料プラン",
    price: "¥0",
    description: "登録不要で一部テンプレートを無料で編集・ダウンロードできます。",
    features: ["一部テンプレートの利用", "Webエディタでの編集", "ダウンロード可能", "広告表示あり"],
    limitations: ["履歴保存なし", "作成文書の再編集なし"],
    cta: "無料で始める",
    href: "/biz/templates",
    highlighted: false,
  },
  {
    name: "Plus Liteプラン",
    price: "¥500/月",
    description: "広告なしで履歴保存、再編集、再ダウンロードまで使える文書管理プランです。",
    features: ["すべてのテンプレート利用", "作成履歴の保存・管理", "再編集・再ダウンロード", "会社情報の自動反映", "お気に入り・フォルダ管理", "AIBOUX FILE / MAIL連携"],
    limitations: [],
    cta: "Plus Liteにアップグレード",
    href: "/biz/pricing",
    highlighted: true,
  },
];

export const bizFaqs: BizFaq[] = [
  { question: "無料プランとPlus Liteプランの違いは何ですか？", answer: "無料プランは一部テンプレートの編集とダウンロードが中心です。Plus Liteでは広告なし、履歴保存、再編集、再ダウンロード、会社情報の自動反映が使えます。" },
  { question: "テンプレートをダウンロードするには会員登録が必要ですか？", answer: "無料テンプレートは会員登録なしでも利用できます。履歴保存や再編集を使う場合はPlus Liteアカウントが必要です。" },
  { question: "商用利用は可能ですか？", answer: "AIBOUX BIZで提供する自社作成テンプレートは業務利用を想定しています。利用前に各文書の注意事項を確認してください。" },
  { question: "作成した文書は保存されますか？", answer: "無料プランでは保存されません。Plus Liteでは作成履歴として保存し、再編集や再ダウンロードができます。" },
  { question: "会社情報の自動反映とは何ですか？", answer: "会社名、住所、担当者、電話番号、ロゴなどを登録しておくと、対応テンプレートへ自動で差し込む機能です。" },
  { question: "PDFやWord形式で出力できますか？", answer: "テンプレートごとに対応形式を表示しています。PDF、Word、Excel、PowerPointなどを順次拡張する設計です。" },
  { question: "広告なしで利用できますか？", answer: "Plus Liteにすると広告枠を非表示にし、文書作成に集中できる画面になります。" },
  { question: "AIBOUX FILEやMAILと連携できますか？", answer: "作成した文書をAIBOUX FILEで送付し、AIBOUX MAILで送信する導線を想定して設計しています。" },
  { question: "解約すると履歴はどうなりますか？", answer: "解約後の履歴保持期間やダウンロード条件は正式サービス開始時の利用規約で明記します。" },
];

export const bizDashboardRows: BizDashboardRow[] = [
  { title: "株式会社サンプル 御見積書", category: "見積書", updatedAt: "2026/05/24 10:12", formats: "PDF / Excel", status: "保存中" },
  { title: "業務委託契約書_山田様", category: "契約書", updatedAt: "2026/05/23 18:30", formats: "Word / PDF", status: "再編集可" },
  { title: "5月度 業務報告書", category: "報告書", updatedAt: "2026/05/22 09:45", formats: "PDF", status: "共有済み" },
  { title: "請求書_INV-2026-0524", category: "請求書", updatedAt: "2026/05/21 15:02", formats: "PDF / Excel", status: "DL済み" },
];
