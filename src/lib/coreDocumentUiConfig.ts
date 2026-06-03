import type { CoreDocumentFormValues } from "@/lib/coreDocumentFormSchema";

export type CoreDocumentType = CoreDocumentFormValues["type"];

export type CoreDocumentUiConfig = {
  type: CoreDocumentType;
  listTitle: string;
  createTitle: string;
  numberPrefix: string;
  numberLabel: string;
  partnerLabel: string;
  destinationTitle: string;
  destinationDescription: string;
  destinationNameLabel: string;
  dateLabel: string;
  thirdCardTitle: string;
  thirdCardDescription: string;
  thirdCardFields: [string, string, string, string?];
  listColumns: {
    number: string;
    partner: string;
    destination: string;
    date: string;
    amount: string;
    owner: string;
    status: string;
    actions: string;
  };
  lineMode: "standard" | "payment";
  csvActions: string[];
  historyCreatedText: string;
  memoPlaceholder: string;
};

export const documentUiConfig: Record<CoreDocumentType, CoreDocumentUiConfig> = {
  quote: {
    type: "quote",
    listTitle: "見積書",
    createTitle: "見積書作成",
    numberPrefix: "Q",
    numberLabel: "見積書番号",
    partnerLabel: "取引先",
    destinationTitle: "提出先",
    destinationDescription: "提出先の会社・部署・担当者を整理します。",
    destinationNameLabel: "会社名",
    dateLabel: "見積日",
    thirdCardTitle: "管理情報",
    thirdCardDescription: "確認予定と社内管理区分をまとめます。",
    thirdCardFields: ["確認予定日", "管理区分", "管理備考"],
    listColumns: {
      number: "書類番号",
      partner: "取引先",
      destination: "提出先",
      date: "見積日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "standard",
    csvActions: [],
    historyCreatedText: "見積書ドラフトを作成",
    memoPlaceholder: "見積条件、補足事項、社内共有事項など",
  },
  order: {
    type: "order",
    listTitle: "注文書",
    createTitle: "注文書作成",
    numberPrefix: "O",
    numberLabel: "注文書番号",
    partnerLabel: "取引先",
    destinationTitle: "納入先",
    destinationDescription: "納入先の会社・部署・担当者を整理します。",
    destinationNameLabel: "会社名",
    dateLabel: "注文日",
    thirdCardTitle: "注文情報",
    thirdCardDescription: "注文日、納期、注文備考をまとめます。",
    thirdCardFields: ["注文日", "納期", "注文備考"],
    listColumns: {
      number: "書類番号",
      partner: "取引先",
      destination: "納入先",
      date: "注文日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "standard",
    csvActions: [],
    historyCreatedText: "注文書ドラフトを作成",
    memoPlaceholder: "注文条件、納期確認、社内共有事項など",
  },
  delivery: {
    type: "delivery",
    listTitle: "納品書",
    createTitle: "納品書作成",
    numberPrefix: "N",
    numberLabel: "納品書番号",
    partnerLabel: "取引先",
    destinationTitle: "納品先",
    destinationDescription: "B2 CSV / 飛伝CSVに合わせて住所要素を分けます。",
    destinationNameLabel: "会社名",
    dateLabel: "納品日",
    thirdCardTitle: "配送情報",
    thirdCardDescription: "配送業者とお問い合わせ番号を必ず残します。",
    thirdCardFields: ["配送業者", "サービス種別", "お問い合わせ番号", "納品日"],
    listColumns: {
      number: "書類番号",
      partner: "取引先",
      destination: "納品先",
      date: "納品日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "standard",
    csvActions: ["B2 CSV", "飛伝CSV"],
    historyCreatedText: "納品書ドラフトを作成",
    memoPlaceholder: "上記の通り納品いたしました。ご確認をお願いいたします。",
  },
  invoice: {
    type: "invoice",
    listTitle: "請求書",
    createTitle: "請求書作成",
    numberPrefix: "I",
    numberLabel: "請求書番号",
    partnerLabel: "取引先",
    destinationTitle: "請求先",
    destinationDescription: "請求先の会社・部署・担当者を整理します。",
    destinationNameLabel: "会社名",
    dateLabel: "請求日",
    thirdCardTitle: "支払情報",
    thirdCardDescription: "支払期限、入金予定、支払方法をまとめます。",
    thirdCardFields: ["支払期限", "入金予定", "支払方法", "請求備考"],
    listColumns: {
      number: "書類番号",
      partner: "取引先",
      destination: "請求先",
      date: "請求日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "standard",
    csvActions: [],
    historyCreatedText: "請求書ドラフトを作成",
    memoPlaceholder: "振込案内、請求条件、社内共有事項など",
  },
  payment: {
    type: "payment",
    listTitle: "入金伝票",
    createTitle: "入金伝票作成",
    numberPrefix: "R",
    numberLabel: "入金伝票番号",
    partnerLabel: "取引先",
    destinationTitle: "入金元",
    destinationDescription: "入金元と照合先の情報を整理します。",
    destinationNameLabel: "会社名",
    dateLabel: "入金日",
    thirdCardTitle: "消込情報",
    thirdCardDescription: "入金日、入金方法、対象請求書、差額をまとめます。",
    thirdCardFields: ["入金日", "入金方法", "対象請求書", "差額"],
    listColumns: {
      number: "書類番号",
      partner: "取引先",
      destination: "対象請求書",
      date: "入金日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "payment",
    csvActions: [],
    historyCreatedText: "入金伝票ドラフトを作成",
    memoPlaceholder: "消込メモ、入金確認事項、社内共有事項など",
  },
  "purchase-order": {
    type: "purchase-order",
    listTitle: "発注書",
    createTitle: "発注書作成",
    numberPrefix: "P",
    numberLabel: "発注書番号",
    partnerLabel: "仕入先",
    destinationTitle: "納入先",
    destinationDescription: "仕入先からの納入先と入荷条件を整理します。",
    destinationNameLabel: "会社名",
    dateLabel: "入荷予定日",
    thirdCardTitle: "発注情報",
    thirdCardDescription: "入荷予定日、発注区分、発注備考をまとめます。",
    thirdCardFields: ["入荷予定日", "発注区分", "発注備考"],
    listColumns: {
      number: "書類番号",
      partner: "仕入先",
      destination: "納入先",
      date: "入荷予定日",
      amount: "金額",
      owner: "担当",
      status: "状態",
      actions: "アクション",
    },
    lineMode: "standard",
    csvActions: [],
    historyCreatedText: "発注書ドラフトを作成",
    memoPlaceholder: "発注条件、入荷予定、社内共有事項など",
  },
};

export function documentUiConfigByType(type: CoreDocumentType): CoreDocumentUiConfig {
  return documentUiConfig[type];
}

export function documentUiConfigByLabel(label: string): CoreDocumentUiConfig {
  const found = Object.values(documentUiConfig).find((config) => config.listTitle === label);
  return found ?? documentUiConfig.quote;
}

