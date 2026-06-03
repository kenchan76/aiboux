export const resumeSite = {
  baseUrl: "https://rirekisho.aiboux.com",
  name: "AIBOUX 履歴書",
  title: "AIBOUX 履歴書 | スマホで履歴書・職務経歴書・退職届・送付状を作成",
  description:
    "AIBOUX 履歴書は、スマホで履歴書・職務経歴書・退職届・送付状・各種チェックリストを作成できる無料サービスです。求人票スクショ解析、AI自己PR、証明写真作成、スーツ合成にも対応します。",
};

export const resumeNavItems = [
  { label: "特徴", href: "/rirekisho/#features" },
  { label: "履歴書", href: "/rirekisho/resume" },
  { label: "職務経歴書", href: "/rirekisho/career" },
  { label: "写真", href: "/rirekisho/photo" },
  { label: "求人解析", href: "/rirekisho/job-scan" },
  { label: "退職届", href: "/rirekisho/resignation" },
  { label: "送付状", href: "/rirekisho/cover-letter" },
  { label: "ヘルプ", href: "/rirekisho/help" },
];

export const heroBadges = ["スマホ対応", "学歴自動入力", "求人票解析", "AI自己PR", "証明写真", "完全無料"];

export const shortcutCards = [
  {
    title: "履歴書作成",
    description: "JIS風の見やすい履歴書をスマホで入力。学歴は自動入力にも対応。",
    href: "/rirekisho/resume/new",
    icon: "履",
  },
  {
    title: "職務経歴書",
    description: "職務要約、実績、スキル、自己PRをステップ式で整理。",
    href: "/rirekisho/career/new",
    icon: "職",
  },
  {
    title: "求人票解析",
    description: "求人票のスクショやPDFから、応募に必要な情報を見やすく整理。",
    href: "/rirekisho/job-scan",
    icon: "解",
  },
  {
    title: "AI自己PR",
    description: "経験・強み・求人票をもとに、200字から400字のたたき台を作成。",
    href: "/rirekisho/self-pr",
    icon: "PR",
  },
  {
    title: "証明写真・スーツ合成",
    description: "顔切り抜き、背景調整、スーツ合成、ネットプリント用PDFまで。",
    href: "/rirekisho/photo",
    icon: "写",
  },
  {
    title: "チェックリスト",
    description: "面接、退職準備、入社準備をスマホで確認しながら進められます。",
    href: "/rirekisho/checklists/interview",
    icon: "✓",
  },
];

export const capabilityCards = [
  { title: "履歴書", href: "/rirekisho/resume", icon: "書", description: "基本情報、学歴、職歴、資格、志望動機を入力" },
  { title: "職務経歴書", href: "/rirekisho/career", icon: "職", description: "職務要約、実績、スキル、自己PRを整理" },
  { title: "退職届", href: "/rirekisho/resignation", icon: "退", description: "宛名、退職日、提出日を整えてPDF化" },
  { title: "送付状", href: "/rirekisho/cover-letter", icon: "封", description: "応募書類に添える送付状を作成" },
  { title: "面接チェック", href: "/rirekisho/checklists/interview", icon: "面", description: "前日・当日・面接後の確認項目" },
  { title: "退職準備", href: "/rirekisho/checklists/resignation", icon: "準", description: "引継ぎ、返却物、書類受領を管理" },
  { title: "入社準備", href: "/rirekisho/checklists/onboarding", icon: "入", description: "初日に必要な持ち物と提出物" },
  { title: "写真作成", href: "/rirekisho/photo", icon: "写", description: "証明写真とネットプリント用PDF" },
  { title: "求人票解析", href: "/rirekisho/job-scan", icon: "求", description: "求人票を見やすい応募データへ整理" },
];

export const templateCards = [
  {
    title: "履歴書（JIS風）",
    description: "一般的な応募で使いやすい、読みやすさ重視の履歴書。",
    badge: "人気",
    rating: "4.8",
    href: "/rirekisho/resume/new",
    rows: ["氏名・連絡先", "学歴・職歴", "資格・志望動機"],
  },
  {
    title: "職務経歴書（標準）",
    description: "経験職種を問わず使いやすい、職務要約つきの形式。",
    badge: "人気",
    rating: "4.7",
    href: "/rirekisho/career/new",
    rows: ["職務要約", "職務経歴", "実績・スキル"],
  },
  {
    title: "退職届（シンプル）",
    description: "退職意思を簡潔に伝えるための整った書式。",
    badge: "シンプル",
    rating: "4.7",
    href: "/rirekisho/resignation",
    rows: ["宛名", "退職日", "署名"],
  },
  {
    title: "送付状（応募書類用）",
    description: "履歴書や職務経歴書に添える送付状。",
    badge: "応募用",
    rating: "4.6",
    href: "/rirekisho/cover-letter",
    rows: ["宛先", "同封書類", "本文"],
  },
  {
    title: "面接チェックリスト",
    description: "面接前後の準備と振り返りを支えるチェックリスト。",
    badge: "確認用",
    rating: "4.6",
    href: "/rirekisho/checklists/interview",
    rows: ["前日準備", "当日確認", "面接後"],
  },
];

export const educationPreview = [
  { year: "2003", month: "04", event: "小学校入学" },
  { year: "2009", month: "03", event: "小学校卒業" },
  { year: "2009", month: "04", event: "中学校入学" },
  { year: "2012", month: "03", event: "中学校卒業" },
  { year: "2012", month: "04", event: "高校入学" },
  { year: "2015", month: "03", event: "高校卒業" },
];

export const jobScanFields = [
  ["会社名", "株式会社エイボックス採用"],
  ["職種", "Webコンテンツ編集"],
  ["給与", "月給 250,000円〜500,000円"],
  ["勤務地", "東京都渋谷区 / リモート併用"],
  ["勤務時間", "9:00〜18:00（休憩60分）"],
  ["必須条件", "文章作成、PC操作、応募書類の提出"],
];

export const photoSteps = ["顔切り抜き", "背景補正", "スーツ合成", "ネットプリント用PDF"];

export const guestBenefits = ["テンプレートのプレビュー", "一時的な編集", "PDFプレビューの一部"];
export const memberBenefits = [
  "履歴書の保存",
  "職務経歴書の保存",
  "再編集",
  "再ダウンロード",
  "求人票スクショ解析",
  "AI自己PR作成",
  "証明写真作成",
  "スーツ合成",
  "チェックリスト保存",
];

export const relatedServices = [
  { name: "aiboux FILE", description: "PDFや画像の整理、応募書類の共有に使える無料ファイルツール。", href: "/file", accent: "blue" },
  { name: "aiboux BIZ", description: "ビジネス文書やテンプレートを探して編集できるサービス。", href: "/biz", accent: "violet" },
  { name: "aiboux MAIL", description: "応募連絡やフォーム送信の控えを整理できるビジネスメール。", href: "/mail", accent: "amber" },
];

export const resumeFaqs = [
  {
    question: "会員登録しなくても使えますか？",
    answer: "サービス説明、テンプレート閲覧、履歴書作成の体験、学歴自動入力、PDFプレビューの一部はログインなしで利用できます。保存・再編集・再ダウンロードには無料会員登録が必要です。",
  },
  {
    question: "有料プランはありますか？",
    answer: "初期版では有料課金を必須にしません。原則フル機能無料で、収益化はメルマガ広告、AIBOUX自社広告、求職者向け関連広告を想定しています。",
  },
  {
    question: "個人情報は保存されますか？",
    answer: "保存機能を使う場合は、履歴書や職務経歴書の入力内容を扱います。利用目的、保存、削除の考え方はプライバシーポリシーで明記します。",
  },
  {
    question: "証明写真はスマホ写真から作れますか？",
    answer: "写真アップロード、顔位置ガイド、背景調整、スーツ合成、ネットプリント向けPDFレイアウトに対応する設計です。",
  },
  {
    question: "求人票スクショ解析とは何ですか？",
    answer: "求人票のスクショ、写真、PDFから会社名、職種、給与、勤務地、勤務時間、必須条件、仕事内容などを整理し、志望動機や自己PR作成に使いやすくします。",
  },
];

export const featurePages = {
  resume: {
    title: "履歴書作成",
    lead: "基本情報、学歴、職歴、資格、志望動機、本人希望欄をスマホで入力し、読みやすい履歴書に整えます。",
    cta: "履歴書を作る",
    ctaHref: "/rirekisho/resume/new",
    highlights: ["JIS風テンプレート", "学歴自動入力", "平成/令和/西暦変換", "写真配置", "PDFプレビュー"],
    sections: [
      ["入力が迷いにくい", "基本情報から本人希望欄まで、スマホで1項目ずつ入力できるステップ式です。"],
      ["学歴を自動生成", "生年月日と制度を選ぶだけで、小学校入学から高校卒業までの目安を生成します。"],
      ["保存して再編集", "無料会員登録をすると、作成途中の履歴書を保存し、あとから修正できます。"],
    ],
  },
  career: {
    title: "職務経歴書作成",
    lead: "職務要約、職務経歴、実績、スキル、自己PRを整理し、読み手に伝わりやすい職務経歴書を作成します。",
    cta: "職務経歴書を作る",
    ctaHref: "/rirekisho/career/new",
    highlights: ["職務要約", "実績整理", "スキル棚卸し", "自己PR", "PDF出力"],
    sections: [
      ["経験を整理", "会社ごと、職種ごとに担当業務と成果を分けて記録できます。"],
      ["自己PRと連携", "経験、強み、応募職種をもとに自己PRのたたき台へ接続できます。"],
      ["スマホ編集", "長文になりやすい職務経歴書も、項目ごとに分けて編集できます。"],
    ],
  },
  photo: {
    title: "証明写真作成",
    lead: "スマホ写真を履歴書用に整え、顔切り抜き、背景調整、スーツ合成、ネットプリント用PDFまで作成します。",
    cta: "写真を作る",
    ctaHref: "/rirekisho/photo",
    highlights: ["顔位置ガイド", "背景調整", "スーツ合成", "3x4", "ネットプリント"],
    sections: [
      ["履歴書用に整える", "顔位置、背景、明るさを確認し、応募書類に使いやすい写真へ整えます。"],
      ["スーツ合成", "私服写真からでも、履歴書向けの落ち着いた見た目へ補正する導線を用意します。"],
      ["印刷用PDF", "L判やA4に複数枚並べ、コンビニ印刷に使いやすいレイアウトを作ります。"],
    ],
  },
  jobScan: {
    title: "求人票スクショ解析",
    lead: "求人票のスクショ、写真、PDFをアップロードし、会社名、職種、条件、仕事内容を応募準備に使いやすく整理します。",
    cta: "求人票を解析する",
    ctaHref: "/rirekisho/job-scan",
    highlights: ["スクショ対応", "PDF対応", "応募条件整理", "志望動機ヒント", "自己PR連携"],
    sections: [
      ["条件を見落とさない", "給与、勤務地、勤務時間、必須条件をカード化し、応募前の確認を支援します。"],
      ["自己PRに接続", "求人票の要件をもとに、経験や強みをどう見せるかのヒントを出します。"],
      ["編集して保存", "解析結果は手動で修正でき、無料会員登録で保存できます。"],
    ],
  },
  selfPr: {
    title: "AI自己PR作成",
    lead: "希望職種、経験、実績、強み、転職理由を入力し、200字・300字・400字の自己PRたたき台を作成します。",
    cta: "自己PRを作る",
    ctaHref: "/rirekisho/self-pr",
    highlights: ["200字", "300字", "400字", "業種別", "求人票反映"],
    sections: [
      ["長さを選べる", "履歴書、職務経歴書、応募フォームに合わせて文字数別に整理します。"],
      ["求人票に合わせる", "解析済み求人票の職種・必須条件・仕事内容を反映できます。"],
      ["そのまま使わない設計", "AI文章はたたき台として出し、本人の経験に合わせて編集する前提です。"],
    ],
  },
};

export const builderPages = {
  resumeNew: {
    title: "履歴書作成",
    description: "基本情報、学歴、職歴、資格、志望動機、本人希望欄、写真を順番に入力します。",
    steps: ["基本情報", "学歴", "職歴", "資格", "志望動機", "写真", "プレビュー"],
    fields: ["氏名", "フリガナ", "生年月日", "電話番号", "メール", "住所"],
    previewTitle: "履歴書（JIS風）",
    saveLabel: "履歴書を保存",
  },
  careerNew: {
    title: "職務経歴書作成",
    description: "職務要約、職務経歴、実績、スキル、自己PRを整理します。",
    steps: ["職務要約", "職務経歴", "実績", "スキル", "自己PR", "プレビュー"],
    fields: ["希望職種", "経験年数", "直近企業", "主な実績", "保有スキル", "自己PR"],
    previewTitle: "職務経歴書（標準）",
    saveLabel: "職務経歴書を保存",
  },
  resignation: {
    title: "退職届作成",
    description: "宛名、退職日、提出日、氏名、理由を入力し、整った退職届を作成します。",
    steps: ["宛名", "退職日", "氏名", "理由", "プレビュー"],
    fields: ["宛名", "所属", "氏名", "退職日", "提出日", "退職理由"],
    previewTitle: "退職届",
    saveLabel: "退職届を保存",
  },
  coverLetter: {
    title: "送付状作成",
    description: "応募書類に添える送付状を、宛先、本文、同封書類から作成します。",
    steps: ["宛先", "本文", "同封書類", "署名", "プレビュー"],
    fields: ["宛先会社名", "採用担当者名", "応募職種", "同封書類", "氏名", "日付"],
    previewTitle: "送付状",
    saveLabel: "送付状を保存",
  },
};

export const checklistPages = {
  interview: {
    title: "面接チェックリスト",
    description: "面接前日、当日、面接後に確認する項目を整理します。",
    groups: [
      ["前日準備", ["企業情報を確認", "履歴書と職務経歴書を見直す", "面接場所と所要時間を確認", "持ち物を準備"]],
      ["当日確認", ["身だしなみを確認", "10分前に到着", "質問したい内容を確認"]],
      ["面接後", ["お礼メールの要否を確認", "次回日程や連絡方法を記録"]],
    ],
  },
  resignation: {
    title: "退職準備チェックリスト",
    description: "退職届、引継ぎ、貸与品返却、必要書類の受領を整理します。",
    groups: [
      ["退職前", ["退職希望日を確認", "上長に相談", "退職届を作成", "引継ぎ範囲を整理"]],
      ["最終出社日", ["貸与品を返却", "データ整理", "挨拶の連絡"]],
      ["退職後", ["離職票を確認", "源泉徴収票を確認", "健康保険・年金手続きを確認"]],
    ],
  },
  onboarding: {
    title: "入社準備チェックリスト",
    description: "入社日に必要な書類、持ち物、連絡事項を整理します。",
    groups: [
      ["提出書類", ["雇用契約書", "身分証明書", "マイナンバー確認書類", "銀行口座情報"]],
      ["持ち物", ["筆記用具", "印鑑", "PC関連案内", "通勤経路メモ"]],
      ["初日確認", ["集合時間", "担当者名", "服装", "緊急連絡先"]],
    ],
  },
};

export const savedItems = [
  { name: "履歴書_営業事務応募", type: "履歴書", updated: "2026/05/24", status: "編集中" },
  { name: "職務経歴書_Web編集", type: "職務経歴書", updated: "2026/05/23", status: "保存済み" },
  { name: "証明写真_3x4", type: "写真", updated: "2026/05/22", status: "PDF作成済み" },
  { name: "求人票解析_渋谷区", type: "求人解析", updated: "2026/05/21", status: "保存済み" },
];

