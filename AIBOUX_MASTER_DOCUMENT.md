# AIBOUX 正本マスター
# サービス全体仕様・URL設計・テナント設計・機能一覧・Bark通知方針・Worker証跡・Dirty Tree状態

## 0. このマスターの位置づけ

この文書は、AIBOUX全体の正本マスターである。
この文書は、AIBOUXシリーズ全サービスのURL、役割、機能、画面、AI機能、データ連携、禁止事項、TBD、運用方針を記録する。
この文書は、次の2箇所に同等内容で反映する。

- `AIBOUX_MASTER_DOCUMENT.md`
- `public/g/m68.md`

公開マスターURLは次である。

- マスター: `https://mail.aiboux.com/g/m68`
- ログ: `https://mail.aiboux.com/g/l68`
- 画面: `https://mail.aiboux.com/g/d68`

`/g/m68` は、AIBOUX全体の正本仕様と現在状態を示す。
`/g/l68` は、実行ログ、コマンド結果、検証結果を示す。
`/g/d68` は、画面証跡、成果物証跡、確認対象を示す。
この文書は、作業者、Codex、Claude、ChatGPT、開発AI、運用者が、過去の文脈を忘れてもAIBOUX全体を復元できるようにするための正本である。

---

## 1. 最上位ルール: 省略禁止

今後、AIBOUXのマスター、仕様、機能一覧、URL設計、作業指示、完了報告で省略は禁止する。

### 1.1 禁止する書き方

以下の書き方は禁止する。

- 「など」で主要機能をまとめること
- 「関連機能」で機能一覧を省略すること
- 「各種設定」で設定項目を省略すること
- 「必要な画面」で画面一覧を省略すること
- 「主要サービス」でサービス一覧を省略すること
- Core / Mail / Shop だけを詳しく書き、Mall / File / Biz / Office / 履歴書 / Docs を薄く書くこと
- 履歴書を省略すること
- Docsを省略すること
- 実装済み、予定、候補、TBDを混ぜること
- 未確認機能を実装済みと書くこと
- 仕様未確定項目を空欄にすること
- 仕様未確定項目を勝手に確定すること
- URLだけ書いて役割を書かないこと
- 役割だけ書いて機能を書かないこと
- 機能だけ書いて対象ユーザーを書かないこと
- 画面名だけ書いて画面の目的を書かないこと
- データ連携を省略すること
- 禁止事項を省略すること
- 次タスクを省略すること

### 1.2 不明点の扱い

不明点は省略しない。
不明点は次の形式で記録する。

```text
TBD: 未確定。次タスクで確認する。
```

仕様が未確定の場合は、次の4分類を必ず付ける。

- 実装済み
- 設計確定
- 設計候補
- TBD

### 1.3 完了報告禁止条件

次の状態では完了報告をしてはいけない。

- 公開m68が英語主体のまま
- 公開m68が短縮版のまま
- 公開m68がURL移行だけの説明のまま
- AIBOUX全サービス一覧がない
- 履歴書がない
- Docsがない
- 各サービスの機能詳細がない
- 各サービスの禁止事項がない
- URL設計の正仕様がない
- テナント設計がない
- 独自ドメイン方針がない
- Bark通知方針がない
- Worker Version ID証跡がない
- dirty tree状態がない
- 次タスクがない

---

## 2. 現在の確定状態

### 2.1 ステータス

DEPLOYED
ACCEPTED_EVIDENCE_LEVEL
CLEANUP_APPROVAL_PENDING
MASTER_REWRITE_REQUIRED

### 2.2 現在の確定情報

- 対象Worker名: aiboux
- Worker Version ID: __WORKER_VERSION_ID__
- Remote repository: https://github.com/kenchan76/aiboux.git
- gate結果: npm run gate:aiboux は AIBOUX_GATE_PASS
- Bark通知方針修正: 完了
- Worker Version ID証跡: 記録済み
- dirty tree cleanup plan: 作成済み
- Classification C削除候補: 未承認
- reset / clean / force push / secret表示: 禁止
- Bark早期送信: 禁止
- shop.aiboux.com/ をストアフロント直URLへ戻すこと: 禁止
- mail.aiboux.com/ をテナント直URLへ戻すこと: 禁止
- aiboux.com をテナントURLへ変更すること: 禁止

### 2.3 URL Bundle

- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68

### 2.4 Git履歴

重要なcommitは次である。

| Commit | 内容 |
| --- | --- |
| baaefcb7256161866d916db3b7cbe745f4546b29 | Bark通知をURL Bundle出力後だけに修正 |
| 88a0577e78d4dd42fb88f6e99af202074ccaa254 | Worker Version ID証跡とgate passを反映 |
| d28c4f3ba8ecf01d8fb437424cdc64751dcedf91 | dirty tree cleanup plan |
| 0ddedfd7dc54896939580b20997fbb0a01820914 | master document source updateとして報告されたcommit |

作業前に必ず確認する。

```bash
cd /home/pkkatsu/aiboux
git fetch origin main
git remote -v
git rev-parse HEAD
git rev-parse origin/main
git log --oneline -5
```

---

## 3. AIBOUX全体思想

AIBOUXは、業務データ、販売、メール、ファイル、オフィス文書、履歴書、ドキュメント、集客導線を統合するシリーズ型サービスである。

AIBOUXは1つの単体アプリではない。
AIBOUXは複数のサービスサイトとテナント画面から構成される。

### 3.1 基本思想

- サブドメイン直下はサービスサイト
- テナント画面は /s/{tenantSlug} 配下
- Shopストアフロントは /s/{tenantSlug}/
- Shop管理画面は /s/{tenantSlug}/admin
- 独自ドメインはストアフロント専用
- Coreは正本データ
- Mailは業務メール接続
- Shopは販売・ストア・商品展開
- Mallは一般顧客向け集客
- Fileはファイル変換・圧縮・分割・共有
- Bizは業務テンプレート・軽量業務ツール
- Officeはブラウザ上の文書編集・変換入口
- 履歴書は個人向け就職書類作成入口
- DocsはAIBOUX全体のヘルプ・操作ガイド

---

## 4. AIBOUX全サービス一覧

| サービス | 正式URL | 役割 | 現在の分類 |
| --- | --- | --- | --- |
| AIBOUX Series Site | https://aiboux.com | AIBOUXシリーズ全体の紹介サイト | サービス紹介 |
| AIBOUX Core | https://core.aiboux.com/ | 業務データ正本、帳票、在庫、取引先、商品管理 | 業務中核 |
| AIBOUX Mail | https://mail.aiboux.com/ | Mailサービスサイト、業務メール入口 | サービスサイト |
| AIBOUX Shop | https://shop.aiboux.com/ | Shopサービスサイト、ストア管理入口 | サービスサイト |
| AIBOUX Mall | https://mall.aiboux.com/ | 一般顧客向けモール、集客入口 | サービスサイト / 集客 |
| AIBOUX File | https://file.aiboux.com/ | ファイル変換、圧縮、分割、共有入口 | 無料入口 / SEO入口 |
| AIBOUX Biz | https://biz.aiboux.com/ | 業務テンプレート、簡易業務ツール入口 | 無料入口 / 業務入口 |
| Aiboux Office | https://office.aiboux.com/ | 文書編集、変換、PDF、Office系入口 | 無料入口 / 文書入口 |
| AIBOUX 履歴書 | https://rirekisho.aiboux.com/ | 履歴書、職務経歴書、就職書類作成 | 個人向け入口 |
| AIBOUX Docs | https://docs.aiboux.com/ | AIBOUX全体のヘルプ、操作ガイド、API説明 | ドキュメント |

### 4.1 URL誤記禁止

以下は誤りである。

- rirekisho.aoboux.com
- doc.aiboux.com
- docs.aoboux.com
- shop.aiboux.com/admin
- mail.aiboux.com/admin
- aiboux.com/s/aiboux

正しいURLは次である。

- https://rirekisho.aiboux.com/
- https://docs.aiboux.com/
- https://shop.aiboux.com/s/aiboux/admin
- https://mail.aiboux.com/s/aiboux/

---

## 5. URL設計の正仕様

### 5.1 全体URL設計

| URL形式 | 役割 |
| --- | --- |
| aiboux.com | AIBOUXシリーズ全体のサービス紹介サイト |
| {service}.aiboux.com/ | 各サービスのサービスサイト |
| {service}.aiboux.com/s/{tenantSlug}/ | テナント画面、テナント業務画面、ストアフロント |
| shop.aiboux.com/s/{tenantSlug}/admin | Shop管理画面 |
| 独自ドメイン | Shopストアフロント専用 |

### 5.2 tenantSlug

今回の仮tenantSlugは次である。

```text
aiboux
```

検証用URLは次になる。

- mail.aiboux.com/s/aiboux/
- shop.aiboux.com/s/aiboux/
- shop.aiboux.com/s/aiboux/admin

### 5.3 サブドメイン直下ルール

サブドメイン直下はサービスサイトである。

例:

- mail.aiboux.com/ はMailサービスサイト
- shop.aiboux.com/ はShopサービスサイト
- docs.aiboux.com/ はDocsサービスサイト
- rirekisho.aiboux.com/ は履歴書サービスサイト

サブドメイン直下にテナント業務画面を直接置いてはいけない。

---

## 6. URL移行判定表

| URL | 旧状態 | 新状態 | 判定 | 移行理由 |
| --- | --- | --- | --- | --- |
| mail.aiboux.com/ | Mailテナント業務画面 | Mailサービスサイト | サービスサイト | サブドメイン直下はサービス紹介サイトに統一するため |
| mail.aiboux.com/s/aiboux/ | 未配置または404 | 旧Mailテナント業務画面 | 業務/管理画面 | メールボックス、受信トレイ、管理者、テンプレート管理を含む業務UIだったため |
| shop.aiboux.com/ | ストアフロント直URLにされていた | Shopサービスサイト | サービスサイト | AIBOUXシリーズのサブドメイン直下はサービスサイトで固定するため |
| shop.aiboux.com/s/aiboux/ | 未配置または別扱い | Shopストアフロント | 顧客向けフロント | テナントstorefrontは /s/{tenantSlug}/ に置くため |
| shop.aiboux.com/s/aiboux/admin | 未配置または混在 | Shop管理画面 | 管理画面 | Shop管理画面は /s/{tenantSlug}/admin に明示分離するため |

---

## 7. AIBOUX Series Site 詳細仕様

### 7.1 サービス名

AIBOUX Series Site

### 7.2 正式URL

https://aiboux.com

### 7.3 役割

AIBOUXシリーズ全体のサービス紹介サイトである。

### 7.4 対象ユーザー

- AIBOUXを初めて知る事業者
- Core、Mail、Shop、Mall、File、Biz、Office、履歴書、Docsへの入口を探すユーザー
- 中小企業
- 個人事業主
- EC事業者
- 求職者
- 社内担当者
- 導入検討者

### 7.5 主要画面

- トップページ
- サービス一覧
- Core紹介
- Mail紹介
- Shop紹介
- Mall紹介
- File紹介
- Biz紹介
- Office紹介
- 履歴書紹介
- Docs紹介
- 導入CTA
- ログイン導線
- お問い合わせ導線
- 料金またはTBD
- よくある質問
- セキュリティ説明
- 運営情報

### 7.6 主要機能

- AIBOUXシリーズ全体の説明
- 各サービスへの遷移
- サービス間連携の説明
- 業務課題別の導線
- 無料入口への誘導
- Core導入への誘導
- Shop導入への誘導
- Mail導入への誘導
- Docsへのヘルプ誘導
- 履歴書への個人向け誘導
- SEO向けサービスページ
- LP構成
- CTAボタン

### 7.7 AI機能

Series Site自体は業務AI処理を担わない。
各サービス内のAI機能を紹介する。

紹介対象:

- Core AI Assistant
- Mail要約AI
- Shop商品説明AI
- Mall集客AI
- File解析AI
- Biz文書作成AI
- Office文章補助AI
- 履歴書自己PR生成AI
- Docs検索AI

### 7.8 Coreとの関係

AIBOUX Series SiteはCoreの紹介入口である。
Coreは業務データ正本であり、Series SiteはCoreへ送客する。

### 7.9 UI方針

- 白基調
- AIBOUXシリーズ共通ヘッダー
- サービスカード
- サービスbadge
- 明確なCTA
- サービス別カラーはTBD
- モバイル対応
- 過剰な専門用語を避ける
- 導入メリットを明確にする

### 7.10 禁止事項

- aiboux.com をテナントURLにしない
- aiboux.com/s/{tenantSlug} を本番テナント入口として扱わない
- Series Siteをアプリ管理画面にしない
- Series Siteでテナントデータを直接表示しない

### 7.11 TBD

- 料金表の最終内容
- 各サービスの公開順
- CTA色
- ロゴ統一ルール
- サービス別アニメーション有無

---

## 8. AIBOUX Core 詳細仕様

### 8.1 サービス名

AIBOUX Core

### 8.2 正式URL

https://core.aiboux.com/

### 8.3 役割

AIBOUX Coreは、業務データの正本を扱う中核サービスである。

Coreは、商品、取引先、納品先、帳票、在庫、請求、支払、仕入、販売、書類、ファイル、メンバー、権限、マスタを管理する。

### 8.4 対象ユーザー

- 中小企業
- 個人事業主
- EC事業者
- 卸売事業者
- 製造業
- 小売業
- 経理担当者
- 受発注担当者
- 在庫担当者
- 管理者
- 現場担当者

### 8.5 主要画面

- ダッシュボード
- 見積一覧
- 見積詳細
- 受注一覧
- 受注詳細
- 請求一覧
- 請求詳細
- 入金一覧
- 入金詳細
- 仕入一覧
- 仕入詳細
- 注文書一覧
- 注文書詳細
- 納品書一覧
- 納品書詳細
- レシート一覧
- レシート新規
- 書類一覧
- 書類詳細
- キャビネット
- キャビネットファイル詳細
- 商品一覧
- 商品詳細
- 商品新規
- 取引先一覧
- 取引先詳細
- 納品先一覧
- 納品先詳細
- 在庫一覧
- 棚卸一覧
- 棚卸結果
- 返品一覧
- 受領請求書一覧
- 連絡先一覧
- 連絡先詳細
- メンバー管理
- 管理者設定
- マスタ一覧
- テンプレート編集
- バーコードスキャン
- ウィザード
- ヘルスダッシュボード
- カスタムビュー
- バスケット
- FLAMインポート
- モバイルホーム
- モバイル通知
- モバイル撮影
- モバイルチャット
- モバイルスキャン
- モバイル商品
- モバイル書類

### 8.6 主要機能

- 商品マスタ管理
- 商品詳細管理
- SKU管理
- 価格管理
- 在庫管理
- 棚卸管理
- 取引先管理
- 納品先管理
- 連絡先管理
- 見積作成
- 受注管理
- 納品書管理
- 請求書管理
- 入金管理
- 仕入管理
- 注文書管理
- 受領請求書管理
- 返品管理
- レシート登録
- OCR処理
- PDF分割
- 書類アップロード
- 書類一覧管理
- 書類詳細確認
- キャビネット管理
- ファイル管理
- テンプレート編集
- メンバー管理
- 権限管理
- マスタ管理
- バーコードスキャン
- モバイル撮影
- モバイルスキャン
- AIチャット
- カスタムビュー
- ヘルスチェック
- FLAMインポート
- 業務データ検索
- 業務データ連携
- 監査用ログ保存

### 8.7 AI機能

- 書類OCR
- PDF分割候補検出
- 書類種別判定
- 商品情報抽出
- 請求情報抽出
- 見積情報抽出
- 納品書情報抽出
- 購買情報抽出
- AI Assistantによる業務支援
- モバイルチャット
- 入力補助
- エラー検知補助
- マスタ候補提案

### 8.8 データ連携

CoreはAIBOUXの正本データを持つ。

Coreから他サービスへ展開するデータ:

- 商品
- SKU
- 価格
- 在庫
- 取引先
- 納品先
- 顧客
- 請求
- 支払
- 帳票
- ファイル
- メンバー
- 権限
- テンプレート
- マスタ

ShopはCoreの商品・在庫・価格を参照または同期する。
MailはCoreの取引先・顧客・書類・案件文脈と接続する。
MallはShopの商品情報を顧客向けに集客する。
DocsはCore操作手順を説明する。

### 8.9 UI方針

- 業務画面として情報密度を確保する
- 操作性を優先する
- 一覧・詳細・編集の導線を明確にする
- モバイルでは専用モバイルUIを使用する
- AppShellを使う画面とモバイル全画面を分ける
- 認証前提画面は未ログインで表示しない
- 業務UIをサービスサイトへ混ぜない

### 8.10 収益方針

- 有料業務サービス本体
- Coreを中心にMail、Shop、File、Biz、Office、Docsへ展開
- 無料入口サービスからCoreへ送客
- 詳細料金はTBD

### 8.11 禁止事項

- Coreの正本データを勝手に作り直さない
- tenant_idを再作成しない
- user_idを再作成しない
- 商品IDを無断で再作成しない
- 既存在庫を破壊しない
- 帳票データをURL移行だけのために変更しない
- Core delivery-detail gateを無関係なservice-url-routingに混ぜない

### 8.12 TBD

- Core料金
- Core権限体系の最終仕様
- CoreとShop同期の最終仕様
- CoreとMail文脈接続の最終仕様
- 監査ログ保存期間
- モバイル機能の公開範囲

---

## 9. AIBOUX Mail 詳細仕様

### 9.1 サービス名

AIBOUX Mail

### 9.2 正式URL

https://mail.aiboux.com/

### 9.3 テナントURL

https://mail.aiboux.com/s/{tenantSlug}/

検証用:

https://mail.aiboux.com/s/aiboux/

### 9.4 役割

AIBOUX Mailは、業務メール、メールボックス、受信トレイ、管理者機能、テンプレート管理をAIBOUX Core文脈に接続するサービスである。

### 9.5 対象ユーザー

- 業務メール担当者
- 受注担当者
- 問い合わせ担当者
- 管理者
- EC運営者
- 中小企業
- 個人事業主
- カスタマーサポート担当者

### 9.6 URL移行理由

旧 mail.aiboux.com/ には、Mailテナント業務画面が出ていた。

旧画面に含まれていた要素:

- メールボックス
- 受信トレイ
- 管理者
- 業務UI
- テンプレート管理に相当する機能
- 認証・業務操作前提の導線

これはサービスサイトではない。
したがって旧業務画面は mail.aiboux.com/s/aiboux/ へ移行した。

mail.aiboux.com/ はMailサービスサイトとして固定する。

### 9.7 主要画面

- Mailサービスサイト
- テナント受信トレイ
- メールボックス
- メール詳細
- 送信画面
- 下書き
- テンプレート管理
- 管理者画面
- 設定
- 連携設定
- Core連携導線
- 問い合わせ管理
- 顧客文脈表示
- 書類添付表示
- AI要約表示
- AI返信候補表示

### 9.8 主要機能

- メール受信
- メール送信
- メールボックス管理
- 受信トレイ管理
- テンプレート管理
- 管理者機能
- 送信者管理
- 顧客紐付け
- 取引先紐付け
- 案件紐付け
- 書類紐付け
- 添付ファイル管理
- 問い合わせ管理
- ステータス管理
- ラベル管理
- 検索
- フィルタ
- 返信履歴
- 内部メモ
- Core連携
- Shop問い合わせ連携
- AI要約
- AI返信候補
- 迷惑メール判定候補
- 重要度判定候補

### 9.9 AI機能

- メール要約
- スレッド要約
- 返信文案生成
- 敬語調整
- クレーム対応文案
- 注文問い合わせ分類
- 返品問い合わせ分類
- 請求問い合わせ分類
- 顧客情報抽出
- 添付書類の内容要約
- Coreの取引履歴参照候補
- Shop注文文脈の参照候補

### 9.10 Coreとの関係

MailはCoreの文脈に接続する。

接続対象:

- 取引先
- 顧客
- 連絡先
- 書類
- 見積
- 受注
- 請求
- 納品
- 商品
- 案件
- ユーザー
- 権限

### 9.11 Shopとの関係

MailはShopの問い合わせ、注文問い合わせ、返品問い合わせ、配送問い合わせと接続する。

ShopからMailへ接続する情報:

- 注文ID
- 顧客名
- メールアドレス
- 商品名
- SKU
- 配送状況
- 支払状況
- 返品状況

### 9.12 UI方針

- サービスサイトと業務画面を分離する
- 直下 mail.aiboux.com/ はサービス紹介
- /s/{tenantSlug}/ は業務画面
- 受信トレイは業務UI
- 管理者画面は業務UI
- 顧客向け公開ページと混ぜない
- メール本文とAI要約を明確に分ける

### 9.13 禁止事項

- mail.aiboux.com/ をテナント業務画面に戻さない
- mail.aiboux.com/ に受信トレイを直出ししない
- 顧客メールをサービスサイトに露出しない
- mailbox_idを再作成しない
- user_idを再作成しない
- tenant_idを再作成しない
- メール本文を公開URLに出さない
- secretをメールテンプレートに出さない

### 9.14 TBD

- メール保存期間
- 添付ファイル保存容量
- 迷惑メール処理方式
- 独自メールドメイン対応
- SPF/DKIM/DMARC設定支援
- AI返信の自動送信可否
- 人間確認必須範囲

---

## 10. AIBOUX Shop 詳細仕様

### 10.1 サービス名

AIBOUX Shop

### 10.2 正式URL

https://shop.aiboux.com/

### 10.3 テナントURL

https://shop.aiboux.com/s/{tenantSlug}/

検証用ストアフロント:

https://shop.aiboux.com/s/aiboux/

検証用管理画面:

https://shop.aiboux.com/s/aiboux/admin

### 10.4 役割

AIBOUX Shopは、Coreの商品・在庫・価格・顧客データをもとに、ShopストアフロントとShop管理画面を提供するECサービスである。

### 10.5 対象ユーザー

- EC事業者
- 小売事業者
- 卸売事業者
- 個人事業主
- 店舗運営者
- 商品管理担当者
- 注文管理担当者
- 在庫担当者
- 顧客対応担当者

### 10.6 URL移行理由

shop.aiboux.com/ は一時的にストアフロント直URLにされていた。

これはAIBOUXのURL設計に反する。

AIBOUXでは、サブドメイン直下はサービスサイトである。
Shopのストアフロントは /s/{tenantSlug}/ に置く。
Shopの管理画面は /s/{tenantSlug}/admin に置く。

### 10.7 主要画面: サービスサイト

- Shopサービスサイト
- 機能紹介
- ストア作成導線
- Core連携説明
- Mall連携説明
- 独自ドメイン説明
- 管理画面説明
- ストアフロント説明
- 料金またはTBD
- 導入CTA
- Docs誘導

### 10.8 主要画面: ストアフロント

- トップページ
- 商品一覧
- 商品詳細
- カテゴリページ
- コレクションページ
- カート
- チェックアウト
- 注文完了
- 顧客ログイン
- マイページ
- 注文履歴
- 配送情報
- 返品案内
- 特定商取引法表示
- プライバシーポリシー
- 問い合わせ
- キャンペーンページ
- SEOページ

### 10.9 主要画面: 管理画面

- Shopダッシュボード
- 注文管理
- 商品管理
- SKU管理
- 在庫管理
- 顧客管理
- 配送設定
- 支払設定
- 税設定
- ストアデザイン
- ストアフロントビルダー
- テーマ設定
- 独自ドメイン設定
- クーポン
- キャンペーン
- モール連携
- Core連携
- Mail連携
- レポート
- 設定
- 管理者権限

### 10.10 主要機能

- 商品公開
- SKU公開
- 価格設定
- 在庫連携
- カート
- チェックアウト
- 注文受付
- 注文管理
- 配送管理
- 顧客管理
- ストアデザイン編集
- ストアフロント生成
- 独自ドメイン対応
- Core商品連携
- Mall掲載連携
- Mail問い合わせ連携
- クーポン管理
- キャンペーン管理
- SEO設定
- 特商法ページ管理
- 返品ポリシー管理
- 決済連携
- 売上レポート
- 商品レポート
- 顧客レポート

### 10.11 AI機能

- 商品説明文生成
- SEOタイトル生成
- メタディスクリプション生成
- カテゴリ説明生成
- 商品画像説明生成
- キャンペーン文言生成
- メール返信文案連携
- 商品タグ候補
- 売れ筋分析候補
- 在庫アラート候補
- 商品改善提案候補

### 10.12 Coreとの関係

ShopはCoreの商品・SKU・価格・在庫を参照または同期する。

CoreからShopへ展開するデータ:

- 商品名
- SKU
- JAN
- 価格
- 在庫
- 商品説明
- 商品画像
- カテゴリ
- 取引先
- 顧客
- 配送先
- 税区分

ShopからCoreへ戻すデータ:

- 注文
- 顧客
- 売上
- 在庫引当
- 返品
- 入金候補
- 問い合わせ文脈

### 10.13 Mallとの関係

Mallは一般顧客向けの集客面である。
Shopはテナントの販売管理面である。

Mallに掲載する商品はShopまたはCoreから供給される。

### 10.14 Mailとの関係

Shop問い合わせはMailへ接続する。

接続対象:

- 注文問い合わせ
- 返品問い合わせ
- 配送問い合わせ
- 商品問い合わせ
- 決済問い合わせ
- 顧客情報
- 注文ID
- SKU

### 10.15 独自ドメイン方針

独自ドメインはストアフロント専用である。

独自ドメインは内部的に次と同等の挙動をする。

```text
shop.aiboux.com/s/{tenantSlug}/
```

独自ドメインに管理画面を置かない。

禁止:

```text
https://example-store.com/admin
```

管理画面は必ず次に置く。

```text
shop.aiboux.com/s/{tenantSlug}/admin
```

### 10.16 UI方針

- サービスサイト、ストアフロント、管理画面を分離する
- サービスサイトは導入検討者向け
- ストアフロントは顧客向け
- 管理画面は事業者向け
- 管理画面はダッシュボード形式
- ストアフロントはテーマ編集可能
- 顧客向け画面に管理導線を出さない
- 管理画面を独自ドメインに出さない

### 10.17 禁止事項

- shop.aiboux.com/ をストアフロント直URLに戻さない
- shop.aiboux.com/admin を管理画面にしない
- 独自ドメインに管理画面を置かない
- shop_idを再作成しない
- tenant_idを再作成しない
- Core商品を無断で複製して正本を壊さない
- 顧客情報を公開ページに露出しない
- 決済secretを公開しない

### 10.18 TBD

- 決済方式
- 送料計算
- 税計算
- 多店舗対応
- モール掲載条件
- クーポン仕様
- ポイント仕様
- サブスクリプション販売
- B2B価格対応
- 管理者権限粒度

---

## 11. AIBOUX Mall 詳細仕様

### 11.1 サービス名

AIBOUX Mall

### 11.2 正式URL

https://mall.aiboux.com/

### 11.3 役割

AIBOUX Mallは、一般顧客向けの集客モールである。

Shopがテナントの販売管理とストアフロントを提供するのに対し、Mallは複数テナントの商品や店舗を横断して顧客へ見せる集客面である。

### 11.4 対象ユーザー

- 一般顧客
- 購入者
- 商品検索ユーザー
- 店舗を探すユーザー
- キャンペーン利用者
- AIBOUX Shop出店者
- EC事業者

### 11.5 主要画面

- Mallトップ
- 商品検索
- 商品一覧
- 商品詳細
- 店舗一覧
- 店舗詳細
- カテゴリ一覧
- カテゴリ詳細
- キャンペーン一覧
- ランキング
- おすすめ
- 検索結果
- カートまたはShop側遷移
- 購入導線
- 出店者紹介
- 出店案内
- 問い合わせ
- ヘルプ

### 11.6 主要機能

- 複数Shop横断の商品掲載
- 商品検索
- カテゴリ検索
- 店舗検索
- ランキング
- レコメンド候補
- キャンペーン掲載
- 店舗ページ
- 商品ページ
- SEO集客
- Shopストアフロントへの送客
- AIBOUX Shopへの出店導線
- Mall掲載管理
- 掲載審査候補
- 広告枠候補
- アフィリエイト候補
- 顧客レビュー候補

### 11.7 AI機能

- 商品レコメンド候補
- 検索キーワード補正
- カテゴリ候補
- 類似商品候補
- 商品説明要約
- レビュー要約候補
- キャンペーン文生成候補
- SEOキーワード候補

### 11.8 Shopとの関係

MallはShopの集客面である。

ShopからMallへ渡す情報:

- 商品
- SKU
- 価格
- 在庫
- 商品画像
- 店舗情報
- キャンペーン
- カテゴリ
- SEO情報

MallからShopへ戻す情報:

- 流入
- 商品閲覧
- 購入導線
- 問い合わせ
- 人気商品
- 検索キーワード

### 11.9 Coreとの関係

MallはCoreの正本データを直接破壊しない。
MallはShop経由またはCore連携された公開用データを表示する。

### 11.10 UI方針

- 顧客向け
- 検索しやすい
- 商品が見やすい
- 店舗が探しやすい
- モバイル優先
- 購入導線を明確にする
- Shop管理画面と混ぜない

### 11.11 収益方針

- Shopへの送客
- 出店誘導
- 広告枠
- 掲載強化
- キャンペーン掲載
- アフィリエイト候補
- 詳細料金はTBD

### 11.12 禁止事項

- MallをShop管理画面にしない
- Mallで管理者向けCRUDを出さない
- MallでCore正本データを直接変更しない
- Mallを独自ドメイン管理画面として使わない
- 顧客個人情報を公開しない

### 11.13 TBD

- Mall決済を持つかShop決済へ送るか
- レビュー機能
- 広告商品
- 掲載審査
- 出店料金
- ランキングロジック
- レコメンドロジック
- 返品問い合わせ導線

---

## 12. AIBOUX File 詳細仕様

### 12.1 サービス名

AIBOUX File

### 12.2 正式URL

https://file.aiboux.com/

### 12.3 役割

AIBOUX Fileは、ファイル変換、圧縮、分割、結合、共有、簡易解析の入口である。

Fileは無料入口、SEO入口、会員登録入口、Coreへの送客装置として機能する。

### 12.4 対象ユーザー

- 個人ユーザー
- 中小企業
- 事務担当者
- EC事業者
- 書類を扱う担当者
- PDFを扱うユーザー
- 画像を扱うユーザー
- Core導入前ユーザー

### 12.5 主要画面

- Fileトップ
- PDF圧縮
- PDF分割
- PDF結合
- PDF変換
- 画像圧縮
- 画像変換
- ファイル共有
- 一時アップロード
- ダウンロード
- 処理結果
- 変換履歴
- 会員登録導線
- Core保存導線
- ヘルプ
- セキュリティ説明

### 12.6 主要機能

- PDF圧縮
- PDF分割
- PDF結合
- PDFページ抽出
- PDF画像化
- 画像圧縮
- 画像形式変換
- ファイル一時共有
- ダウンロードURL生成
- ファイル名整理
- ファイルサイズ確認
- ページ数確認
- 簡易OCR候補
- Core保存候補
- キャビネット連携候補
- 会員登録導線
- 無料処理上限
- 処理履歴
- セキュリティ注意表示

### 12.7 AI機能

- 書類種別判定候補
- ファイル名候補生成
- OCR候補
- ページ分割候補
- 内容要約候補
- Core保存先候補
- 機密情報検知候補

### 12.8 Coreとの関係

FileはCoreキャビネットへの入口になる。

Fileで処理したファイルをCoreへ保存する候補:

- PDF
- 画像
- 請求書
- 納品書
- 見積書
- 注文書
- レシート
- 証憑
- 契約書

### 12.9 UI方針

- 無料ツールとして分かりやすい
- ドロップエリアを大きくする
- 処理前後のファイルサイズを表示する
- セキュリティ注意を明示する
- Core保存CTAを出す
- ファイルを無期限保存しない前提を明記する

### 12.10 収益/送客方針

- 無料ファイル処理入口
- Coreへの会員登録導線
- 広告候補
- 有料大容量処理候補
- 法人向け保存導線
- 詳細料金はTBD

### 12.11 禁止事項

- ファイルを無断で永久保存しない
- 保存期間を未確定のまま断定しない
- 機密ファイルを公開URLに出さない
- ダウンロードURLにsecretを出さない
- 個人情報を学習利用すると断定しない
- Core保存前にユーザー同意を省略しない

### 12.12 TBD

- 無料処理上限
- 最大ファイルサイズ
- 保存期間
- 広告表示有無
- ログ保存範囲
- OCR無料枠
- Core保存仕様
- 一時共有URL期限

---

## 13. AIBOUX Biz 詳細仕様

### 13.1 サービス名

AIBOUX Biz

### 13.2 正式URL

https://biz.aiboux.com/

### 13.3 役割

AIBOUX Bizは、業務テンプレート、簡易業務ツール、文書作成補助、業務チェックリストの入口である。

Bizは無料入口、SEO入口、Coreへの送客装置として機能する。

### 13.4 対象ユーザー

- 中小企業
- 個人事業主
- 事務担当者
- 営業担当者
- 経理担当者
- 起業準備中のユーザー
- フリーランス
- 店舗運営者

### 13.5 主要画面

- Bizトップ
- 業務テンプレート一覧
- 見積テンプレート
- 請求テンプレート
- 納品テンプレート
- 発注テンプレート
- 契約書テンプレート
- 業務チェックリスト
- 計算ツール
- 文書作成補助
- AI文案作成
- ダウンロード
- Core保存導線
- 会員登録導線
- Docs誘導

### 13.6 主要機能

- 業務テンプレート提供
- 見積書テンプレート
- 請求書テンプレート
- 納品書テンプレート
- 発注書テンプレート
- 契約書テンプレート
- 退職関連テンプレート候補
- 業務チェックリスト
- 税計算候補
- 消費税計算候補
- 粗利計算候補
- 見積文面生成候補
- 請求文面生成候補
- メール文面生成候補
- Coreへのデータ移行導線
- PDF出力候補
- Office連携候補

### 13.7 AI機能

- 業務文書生成
- 件名生成
- メール文案生成
- 契約条項候補
- チェックリスト生成
- 業務フロー整理
- 見積説明文生成
- 請求催促文生成
- お詫び文生成
- FAQ生成候補

### 13.8 Coreとの関係

BizはCore導入前の入口になる。
Bizで作った見積、請求、納品、取引先情報をCoreへ移行する導線を持つ。

### 13.9 Mailとの関係

Bizで生成した文面をMailへ渡す候補がある。

対象:

- 見積送付メール
- 請求送付メール
- 催促メール
- お礼メール
- お詫びメール
- 問い合わせ返信

### 13.10 UI方針

- テンプレートを探しやすくする
- 無料ですぐ使える導線を強くする
- Coreへの保存導線を自然に出す
- 法務・税務の確定助言ではない注意を出す
- 文書作成AIの結果はユーザー確認前提にする

### 13.11 収益/送客方針

- 無料テンプレートでSEO集客
- Coreへの送客
- Mailへの送客
- Officeへの送客
- 広告候補
- 有料テンプレート候補
- 詳細料金はTBD

### 13.12 禁止事項

- 法律・税務の確定助言を断定しない
- AI文書を人間確認なしで正式文書扱いしない
- 契約書テンプレートを弁護士監修済みと勝手に表示しない
- Coreデータを勝手に作成しない
- 個人情報を公開しない

### 13.13 TBD

- テンプレート種類
- 無料/有料範囲
- PDF出力
- Word出力
- Core保存仕様
- AI生成回数制限
- 監修表示の有無

---

## 14. Aiboux Office 詳細仕様

### 14.1 サービス名

Aiboux Office

### 14.2 正式URL

https://office.aiboux.com/

### 14.3 役割

Aiboux Officeは、ブラウザ上で文書、表、PDF、画像を扱う入口である。

Officeは無料入口、SEO入口、Core / File / Bizへの送客装置である。

### 14.4 対象ユーザー

- 個人ユーザー
- 事務担当者
- 中小企業
- フリーランス
- 学生
- 書類作成者
- PDF編集者
- Office文書利用者

### 14.5 主要画面

- Officeトップ
- 文書エディタ
- 表エディタ
- PDFツール
- 画像ツール
- テンプレート一覧
- ファイル変換
- ファイルダウンロード
- File連携
- Biz連携
- Core保存導線
- ヘルプ
- セキュリティ説明

### 14.6 主要機能

- ブラウザ文書作成
- 簡易表作成
- PDF変換候補
- PDF結合候補
- PDF分割候補
- 画像変換候補
- 文書テンプレート
- 業務テンプレート連携
- File連携
- Biz連携
- Core保存候補
- ローカル処理候補
- ダウンロード
- 印刷
- 共有候補
- AI文章補助候補

### 14.7 AI機能

- 文書作成補助
- 文章校正
- 要約
- 箇条書き生成
- 表題生成
- メール文変換
- ビジネス文体変換
- テンプレート補完
- 翻訳候補
- 誤字脱字候補

### 14.8 Fileとの関係

OfficeはFileの文書・PDF・画像処理機能へ接続する。

### 14.9 Bizとの関係

OfficeはBizのテンプレートを編集する入口になる。

### 14.10 Coreとの関係

Officeで作成した業務文書をCoreへ保存する候補がある。

保存候補:

- 見積
- 請求
- 納品
- 契約
- 社内資料
- 添付資料

### 14.11 UI方針

- ブラウザで分かりやすく使える
- ファイル本体を原則サーバーへ送信しない設計を優先する
- サーバー送信が必要な場合は明示する
- 完全互換を断定しない
- ダウンロード導線を明確にする
- Core保存CTAを出す

### 14.12 禁止事項

- Office/PDF完全互換を勝手に謳わない
- ファイルを無断でサーバー保存しない
- ローカル処理とサーバー処理を混同しない
- 保存期間を勝手に断定しない
- Microsoft Office互換を過剰に表現しない
- Google Docs互換を過剰に表現しない

### 14.13 TBD

- ローカル処理範囲
- サーバー処理範囲
- PDF編集機能範囲
- docx/xlsx/pptx対応範囲
- 保存期間
- 最大ファイルサイズ
- 有料機能
- 広告表示
- Core保存仕様

---

## 15. AIBOUX 履歴書 詳細仕様

### 15.1 サービス名

AIBOUX 履歴書

### 15.2 正式URL

https://rirekisho.aiboux.com/

### 15.3 誤記禁止

次は誤りである。

https://rirekisho.aoboux.com/

英字badge RIREKISHO を主表示にしない。
日本語サービス名は「履歴書」とする。

### 15.4 役割

AIBOUX 履歴書は、履歴書、職務経歴書、退職届、送付状、就職活動用チェックリスト、求人票解析、自己PR作成、志望動機作成、証明写真作成を扱う個人向けサービスである。

### 15.5 対象ユーザー

- 求職者
- 転職希望者
- 新卒就職活動者
- アルバイト応募者
- パート応募者
- 派遣登録者
- 退職届を作成したいユーザー
- 職務経歴書を作成したいユーザー
- 自己PRを作りたいユーザー
- 志望動機を作りたいユーザー
- 証明写真を作りたいユーザー

### 15.6 主要画面

- 履歴書トップ
- 履歴書作成
- 職務経歴書作成
- 退職届作成
- 送付状作成
- 自己PR作成
- 志望動機作成
- 求人票解析
- 証明写真作成
- チェックリスト
- テンプレート選択
- 入力フォーム
- プレビュー
- PDF出力
- ダウンロード
- 保存
- 削除
- 同意画面
- プライバシー説明
- 配信停止
- Docs誘導
- FAQ

### 15.7 主要機能

- 履歴書作成
- 職務経歴書作成
- 退職届作成
- 送付状作成
- 自己PR作成
- 志望動機作成
- 長所短所作成
- 職歴整理
- 学歴整理
- 資格整理
- 希望条件整理
- 通勤時間入力
- 扶養情報入力
- 本人希望欄作成
- 求人票解析
- 求人票に合わせた自己PR候補
- 求人票に合わせた志望動機候補
- 証明写真作成
- 写真トリミング
- 写真背景調整候補
- PDF出力
- 印刷用レイアウト
- スマホ入力
- PC入力
- 保存
- 削除
- エクスポート
- 入力チェック
- 誤字脱字チェック
- 提出前チェックリスト
- メール送付文候補

### 15.8 AI機能

- 自己PR生成
- 志望動機生成
- 職務要約生成
- 経歴の言い換え
- 強み抽出
- 求人票解析
- 求人票との一致点抽出
- 応募先別文面調整
- 誤字脱字確認
- 敬語調整
- 短文化
- 長文化
- 面接想定質問候補
- 退職届文面生成
- 送付状文面生成

### 15.9 個人情報方針

履歴書サービスは、個人情報と顔写真を扱う。

特に保護が必要な情報:

- 氏名
- 生年月日
- 住所
- 電話番号
- メールアドレス
- 学歴
- 職歴
- 資格
- 顔写真
- 志望先
- 退職理由
- 希望条件
- 扶養情報
- 通勤情報

必須設計:

- 明示的な同意
- 削除機能
- 保存期間表示
- 配信停止
- 利用目的表示
- AI利用範囲表示
- 顔写真の扱い表示
- ダウンロード後の保存責任説明
- 公開URL化しない
- secretを出さない
- 個人情報を学習利用すると断定しない
- 保存期間が未確定ならTBDと書く

### 15.10 Coreとの関係

履歴書はCoreの業務正本とは原則分離する。
企業向け採用管理機能へ接続する場合はTBD。
個人履歴書データをCoreテナントへ勝手に移動しない。

### 15.11 Docsとの関係

Docsは履歴書の操作説明、FAQ、個人情報の扱い、削除方法、PDF出力手順を説明する。

### 15.12 UI方針

- 日本語中心
- 履歴書らしい安心感
- 入力しやすいフォーム
- プレビュー重視
- スマホ対応
- 保存・削除を明確にする
- 個人情報の扱いを明確にする
- AI生成文はユーザー確認前提
- 英字badge RIREKISHO を主表示にしない

### 15.13 収益/送客方針

- 無料履歴書作成入口
- 広告候補
- 有料テンプレート候補
- 証明写真機能候補
- 就職支援サービス送客候補
- Docs誘導
- 詳細料金はTBD

### 15.14 禁止事項

- 履歴書を省略しない
- rirekisho.aiboux.com を誤記しない
- rirekisho.aoboux.com と書かない
- 英字 RIREKISHO badgeを主表示にしない
- 顔写真を無断保存しない
- 個人情報を公開URLに出さない
- PDFを第三者へ無断共有しない
- AI生成文をそのまま提出推奨と断定しない
- 保存期間を未確定のまま断定しない
- 削除導線を省略しない

### 15.15 TBD

- 保存期間
- 無料保存件数
- PDF出力形式
- 証明写真処理方式
- 顔写真の保存有無
- AI生成回数制限
- 会員登録必須範囲
- 広告表示有無
- 求人サービス連携有無
- 職務経歴書テンプレート数

---

## 16. AIBOUX Docs 詳細仕様

### 16.1 サービス名

AIBOUX Docs

### 16.2 正式URL

https://docs.aiboux.com/

### 16.3 誤記禁止

次は誤りである。

https://doc.aiboux.com/

正しいURLは次である。

https://docs.aiboux.com/

### 16.4 役割

AIBOUX Docsは、AIBOUX全体のヘルプ、操作ガイド、仕様説明、API説明、管理者向け手順、トラブルシューティング、FAQを提供するドキュメントサービスである。

Docsは、AIBOUXシリーズ全体の理解を支援する。
Docsは、ユーザー、管理者、開発者、サポート担当者の共通参照先である。

### 16.5 対象ユーザー

- AIBOUX利用者
- 管理者
- 現場担当者
- Shop運営者
- Mail運用者
- Core管理者
- File利用者
- Biz利用者
- Office利用者
- 履歴書利用者
- 開発者
- API利用者
- サポート担当者
- 導入検討者

### 16.6 主要画面

- Docsトップ
- 左ツリーナビ
- 中央Markdown本文
- 右目次
- 上部検索
- サービス別ガイド
- はじめに
- Coreガイド
- Mailガイド
- Shopガイド
- Mallガイド
- Fileガイド
- Bizガイド
- Officeガイド
- 履歴書ガイド
- APIガイド
- 管理者ガイド
- トラブルシューティング
- FAQ
- リリースノート
- セキュリティ
- 用語集

### 16.7 主要機能

- Markdownドキュメント表示
- 左ツリーナビ
- 右目次
- 全文検索
- サービス別カテゴリ
- 用語集
- FAQ
- 操作手順
- 画像付き手順
- APIリファレンス候補
- OpenAPI導線候補
- バージョン管理候補
- 更新履歴
- リリースノート
- 関連記事
- コードブロック
- コマンド例
- 注意書き
- 警告表示
- 問い合わせ導線
- サポート導線

### 16.8 AI機能

- Docs検索AI
- 質問応答AI
- 関連ページ候補
- 操作手順案内
- エラー原因候補
- コマンド説明候補
- API利用例生成候補
- ユーザー向け説明文変換
- 管理者向け説明文変換

### 16.9 各サービスとの関係

Docsは全サービスの操作説明を持つ。

Docsで扱う対象:

- AIBOUX Series Site
- Core
- Mail
- Shop
- Mall
- File
- Biz
- Office
- 履歴書
- Docs自身

### 16.10 Coreとの関係

DocsはCoreの操作説明を提供する。

対象:

- 商品管理
- 取引先管理
- 納品先管理
- 見積
- 受注
- 請求
- 入金
- 仕入
- 注文書
- 納品書
- レシート
- 書類
- キャビネット
- 在庫
- 棚卸
- メンバー
- 権限
- マスタ
- モバイル

### 16.11 Shopとの関係

DocsはShopの操作説明を提供する。

対象:

- サービスサイト
- ストアフロント
- 管理画面
- 商品管理
- SKU
- 在庫
- 注文
- 顧客
- 決済
- 配送
- 独自ドメイン
- Mall連携
- Mail連携

### 16.12 Mailとの関係

DocsはMailの操作説明を提供する。

対象:

- 受信トレイ
- メールボックス
- 返信
- テンプレート
- 管理者
- 顧客連携
- Core連携
- Shop問い合わせ連携
- AI要約
- AI返信候補

### 16.13 履歴書との関係

Docsは履歴書の操作説明を提供する。

対象:

- 履歴書作成
- 職務経歴書作成
- 退職届作成
- 送付状作成
- 自己PR生成
- 志望動機生成
- 証明写真
- PDF出力
- 個人情報削除
- 保存期間
- 同意
- 配信停止

### 16.14 UI方針

- 左ツリーナビ
- 中央Markdown本文
- 右目次
- 上部検索
- モバイルではツリーを折りたたむ
- 目次を見やすくする
- コマンド例をコピーしやすくする
- 注意・警告・禁止事項を目立たせる
- サービス別に分類する
- URL誤記を避ける
- 古い仕様には非推奨表示を付ける

### 16.15 収益/送客方針

Docsは直接収益ではなく、サポート削減、導入支援、SEO、会員登録支援、サービス理解促進を担う。

送客先:

- Core
- Mail
- Shop
- File
- Biz
- Office
- 履歴書
- サポート
- 問い合わせ

### 16.16 禁止事項

- Docsを省略しない
- doc.aiboux.com と書かない
- 古い仕様を最新仕様として放置しない
- 実装済みと未実装を混ぜない
- API secretをDocsに出さない
- ユーザー固有情報をDocsに出さない
- private URLを公開しない
- 管理者専用手順を一般ユーザー向けに露出しない

### 16.17 TBD

- Docsのビルド方式
- Markdown保存場所
- 検索方式
- バージョン管理
- APIリファレンス生成
- OpenAPI連携
- 多言語対応
- 認証付きDocs範囲
- 管理者専用Docs
- 画像管理方式

---

## 17. MCP / API 方針

### 17.1 役割

AIBOUXは、将来的にMCP/API接続を通じて外部AI、外部ツール、社内ツール、EC連携、業務自動化を扱う。

### 17.2 対象候補

- Core API
- Shop API
- Mail API
- File API
- Docs API
- AI Assistant
- 商品検索
- 顧客検索
- 帳票検索
- 在庫照会
- 注文照会
- メール要約
- 文書生成
- ファイル解析

### 17.3 禁止事項

- API keyを公開しない
- tokenをログに出さない
- secretをDocsに出さない
- public artifactに認証情報を書かない
- MCP接続を実装済みと断定しない
- 未確定API仕様を確定版として公開しない

### 17.4 TBD

- MCP提供範囲
- API認証方式
- rate limit
- 外部連携課金
- APIドキュメント生成
- SDK提供
- 管理者権限
- 監査ログ

---

## 18. UI / ロゴ / Badge 方針

### 18.1 共通UI

AIBOUXシリーズは共通ブランドを保つ。

共通要素:

- AIBOUXロゴ
- サービス名badge
- 共通ヘッダー
- 共通フッター
- サービスカード
- CTA
- Docs導線
- ログイン導線
- サポート導線

### 18.2 サービス別badge

| サービス | badge |
| --- | --- |
| Core | AIBOUX Core |
| Mail | AIBOUX Mail |
| Shop | AIBOUX Shop |
| Mall | AIBOUX Mall |
| File | AIBOUX File |
| Biz | AIBOUX Biz |
| Office | Aiboux Office |
| 履歴書 | AIBOUX 履歴書 |
| Docs | AIBOUX Docs |

### 18.3 履歴書badge禁止

履歴書サービスで、英字 RIREKISHO を主badgeにしてはいけない。

正しい表記:

AIBOUX 履歴書

---

## 19. Bark通知方針

Barkは完了判定ゲートではない。
Barkは通知手段である。

固定英文チェック文:

- Bark notification timing is fixed to URL Bundle only.
- Bark may be sent only after the URL Bundle has already been output.
- Bark delivery and receipt confirmation are notification evidence only.
- Bark receipt confirmation is not a completion gate.

### 19.1 送信してよいタイミング

Barkは、URL Bundleが出力された後に1回だけ送信してよい。

URL Bundle:

- マスター: https://mail.aiboux.com/g/m68
- ログ: https://mail.aiboux.com/g/l68
- 画面: https://mail.aiboux.com/g/d68

### 19.2 URL Bundleがない場合

URL Bundleがない場合、Barkは送信しない。

skip理由:

```text
URL_BUNDLE_REQUIRED_BEFORE_BARK
```

### 19.3 Bark本文

Bark本文に含める。

- Master URL
- Log URL
- Screen URL
- Worker Version ID
- 最終状態

### 19.4 Bark受領確認

Bark受領確認は完了ゲートではない。

userReceiptConfirmed=true が未確認でも、検証済みタスクを USER_ACTION_REQUIRED に落としてはいけない。

### 19.5 送信禁止タイミング

以下でBarkを送らない。

- 作業開始
- 実行中
- watcher起動
- watcher停止
- build PASS
- deploy PASS
- Playwright PASS
- review OK
- review NG
- 自動修正完了
- 途中エラー
- Bark受領確認待ち

### 19.6 secret禁止

Bark keyを次へ出さない。

- チャット
- スクリーンショット
- GitHub
- public URL
- all_log
- ops/instructions
- AIBOUX_MASTER_DOCUMENT.md
- public/g/m68.md
- Bark本文

---

## 20. Gate分離方針

### 20.1 分離するgate

- generic
- service-url-routing
- Core delivery-detail
- Bark receipt policy
- Worker Version ID evidence
- report policy
- control chars
- mojibake
- build

### 20.2 service-url-routingで見る項目

- サービスサイトURL
- テナントURL
- Shop管理画面URL
- Storefront URL
- /g/m68
- /g/l68
- /g/d68
- Worker Version ID
- Bark通知方針
- public routing
- _astro CSS
- markdown content-type

### 20.3 混ぜてはいけない項目

Core delivery-detail UI gateを、service-url-routingの完了ゲートに混ぜない。

Bark受領確認を、実装完了ゲートに混ぜない。

AIレビュー無応答を、成功扱いまたは失敗扱いとして勝手に混ぜない。

---

## 21. Worker Version ID証跡

### 21.1 Worker

Worker name: aiboux
Worker Version ID: __WORKER_VERSION_ID__
Deployment ID: ab13f87a-b776-4c94-9c25-6081db15f1af
Deployment created_on: 2026-05-31T14:22:16.574248Z
Version percentage: 100

### 21.2 証跡ファイル

all_log/79_worker_version_id_evidence_after_push.md

### 21.3 確認コマンド

```bash
npx wrangler versions list --name aiboux --json
npx wrangler deployments list --name aiboux --json
```

### 21.4 注意

npx wrangler deploy を再実行するとWorker Version IDが変わる可能性がある。

再デプロイ後は、必ずWorker Version ID証跡を更新する。

---

## 22. 公開URL検証

### 22.1 検証対象8URL

| URL | 期待状態 |
| --- | --- |
| https://mail.aiboux.com/ | Mailサービスサイト |
| https://mail.aiboux.com/s/aiboux/ | 旧Mailテナント業務画面 |
| https://shop.aiboux.com/ | Shopサービスサイト |
| https://shop.aiboux.com/s/aiboux/ | Shopストアフロント |
| https://shop.aiboux.com/s/aiboux/admin | Shop管理画面 |
| https://mail.aiboux.com/g/m68 | マスターMarkdown |
| https://mail.aiboux.com/g/l68 | ログMarkdown |
| https://mail.aiboux.com/g/d68 | 画面証跡Markdown |

### 22.2 必須確認

- HTTP 200
- 文字化けなし
- 不正制御文字なし
- HTML画面の _astro CSSがHTTP 200
- /g/* が text/markdown; charset=utf-8
- m68 が日本語詳細マスター本文
- m68 が英語主体ではない
- m68 に全サービス詳細が含まれる
- m68 に履歴書とDocsが含まれる

### 22.3 ChatGPT外部fetchの扱い

ChatGPT側の外部fetch経路では、Cache miss が出る場合がある。

それ単独を理由に再修正ループへ戻してはいけない。

正とする証跡:

- Codex/SSHのcurl結果
- Playwright公開URLテスト
- npm run gate:aiboux
- Worker Version ID証跡
- all_log の記録
- 実ブラウザ確認

---

## 23. Dirty Tree状態

### 23.1 直近件数

直近の報告値:

git status --short: 約345行
git status --short --untracked-files=all: 約1213行
untracked files: 約1201件
tracked source/config diffs: 12件

### 23.2 分類A: 次タスクに必要

- src/
- db/
- migrations/
- scripts/
- tests/
- wrangler.toml
- package.json
- package-lock.json
- gate関連
- Cloudflare設定
- runtime関連
- verification関連

### 23.3 分類B: 証跡として残す

- all_log/
- output/
- docs/
- ops/
- スクリーンショット
- review pack
- test result
- public URL verification log

### 23.4 分類C: 削除候補だが未承認

- .vscode/starwind.code-snippets
- ゼロバイトmarker file
- AIBOUX
- Mailサービスサイト
- 対応テナントの
- 旧
- public/temp/imagegen/.gitkeep
- 古い生成物
- 古い output/
- 古い all_log/

分類Cは削除未承認である。
ユーザーが明示承認するまで削除しない。

---

## 24. 絶対禁止事項

以下は禁止する。

```bash
git reset --hard
git clean -fd
git clean -fdx
rm -rf
```

さらに禁止する。

- 未追跡ファイル削除
- tracked source/config diff の勝手なrevert
- source/configの勝手な変更
- Cloudflare設定の勝手な変更
- secret表示
- PAT表示
- API key表示
- token表示
- .env表示
- .dev.vars表示
- Bark早期送信
- Bark endpoint表示
- force push
- shop.aiboux.com/ をストアフロント直URLに戻すこと
- mail.aiboux.com/ をテナント直URLに戻すこと
- aiboux.com をテナントURLにすること
- 独自ドメインに管理画面を置くこと
- tenant_id再作成
- shop_id再作成
- mailbox_id再作成
- user_id再作成
- 公開m68が旧本文のまま完了報告
- 公開m68が英語主体のまま完了報告
- 履歴書を省略したまま完了報告
- Docsを省略したまま完了報告

---

## 25. 次タスク

次タスクは、破壊的cleanupではない。

次タスクは、dirty treeの安全な棚卸しと、Classification C削除候補のユーザー承認待ちである。

### 25.1 次にやること

1. git status --short を再取得
2. git status --short --untracked-files=all を再取得
3. tracked source/config diff 12件をレビュー
4. untracked約1200件をカテゴリ集計
5. 分類A/B/Cを再確認
6. Classification C削除候補を一覧化
7. USER_ACTION_REQUIRED としてユーザー承認を求める
8. 承認が出るまで削除しない
9. git clean から始めない
10. git reset しない
11. source/configを勝手に戻さない

### 25.2 次タスク完了条件

- dirty tree分類が更新されている
- Classification C削除候補が明示されている
- 削除は実行していない
- resetしていない
- cleanしていない
- force pushしていない
- Bark送信していない
- secret表示していない
- ユーザー承認待ちで止めている

---

## 26. 公開m68反映証跡

このセクションは、public/g/m68.md と公開URL https://mail.aiboux.com/g/m68 の一致を記録する。

### 26.1 必須記録項目

確認日時:
  TBD。実測して記録する。
確認コマンド:
  curl -sS -L -D /tmp/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/m68.body
HTTP status:
  TBD。期待値: 200
content-type:
  TBD。期待値: text/markdown; charset=utf-8
cache-control:
  TBD。実測して記録する。
public/g/m68.md sha256:
  TBD。実測して記録する。
公開 https://mail.aiboux.com/g/m68 本文 sha256:
  TBD。実測して記録する。
ソースと公開本文:
  TBD。一致 / 不一致 / 差分理由を記録する。
デプロイ後Worker Version ID:
  TBD。再デプロイした場合は更新する。
gate:aiboux:
  TBD。期待値: AIBOUX_GATE_PASS

### 26.2 機械確認コマンド

```bash
cd /home/pkkatsu/aiboux
sha256sum public/g/m68.md
curl -sS -L -D /tmp/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/m68.body
cat /tmp/m68.headers
sha256sum /tmp/m68.body
grep -q "省略禁止" /tmp/m68.body
grep -q "AIBOUX全サービス一覧" /tmp/m68.body
grep -q "AIBOUX Core 詳細仕様" /tmp/m68.body
grep -q "AIBOUX Mail 詳細仕様" /tmp/m68.body
grep -q "AIBOUX Shop 詳細仕様" /tmp/m68.body
grep -q "AIBOUX Mall 詳細仕様" /tmp/m68.body
grep -q "AIBOUX File 詳細仕様" /tmp/m68.body
grep -q "AIBOUX Biz 詳細仕様" /tmp/m68.body
grep -q "Aiboux Office 詳細仕様" /tmp/m68.body
grep -q "AIBOUX 履歴書 詳細仕様" /tmp/m68.body
grep -q "AIBOUX Docs 詳細仕様" /tmp/m68.body
grep -q "rirekisho.aiboux.com" /tmp/m68.body
grep -q "docs.aiboux.com" /tmp/m68.body
grep -q "URL移行判定表" /tmp/m68.body
grep -q "Bark通知方針" /tmp/m68.body
grep -q "Worker Version ID" /tmp/m68.body
grep -q "Dirty Tree状態" /tmp/m68.body
grep -q "絶対禁止事項" /tmp/m68.body
grep -q "次タスク" /tmp/m68.body
```

---

## 27. Codexへの反映指示

この日本語正本マスターを、次のファイルに反映する。

- AIBOUX_MASTER_DOCUMENT.md
- public/g/m68.md
- ops/instructions/current.md
- all_log/84_master_no_omission_full_service_spec.md

### 27.1 実行コマンド

```bash
npm run check:control-chars
npm run check:mojibake
npm run gate:aiboux
ESBUILD_WORKER_THREADS=0 npm run build
npx wrangler deploy
```

### 27.2 公開確認

```bash
curl -sS -L -D /tmp/m68.headers https://mail.aiboux.com/g/m68 -o /tmp/m68.body
cat /tmp/m68.headers
head -c 4000 /tmp/m68.body
```

### 27.3 commit

問題なければcommitする。

```bash
git add AIBOUX_MASTER_DOCUMENT.md public/g/m68.md ops/instructions/current.md all_log/84_master_no_omission_full_service_spec.md
git commit -m "docs: expand master with full service specifications"
git push origin HEAD:refs/heads/main
```

### 27.4 完了条件

- 公開 https://mail.aiboux.com/g/m68 が日本語詳細マスター本文を返す
- HTTP 200
- content-type: text/markdown; charset=utf-8
- 省略禁止ルールが入っている
- AIBOUX全サービス一覧が入っている
- Core詳細仕様が入っている
- Mail詳細仕様が入っている
- Shop詳細仕様が入っている
- Mall詳細仕様が入っている
- File詳細仕様が入っている
- Biz詳細仕様が入っている
- Office詳細仕様が入っている
- 履歴書詳細仕様が入っている
- Docs詳細仕様が入っている
- rirekisho.aiboux.com が入っている
- docs.aiboux.com が入っている
- URL移行判定表が入っている
- Bark通知方針が入っている
- Worker Version ID証跡が入っている
- Dirty Tree状態が入っている
- 絶対禁止事項が入っている
- 次タスクが入っている
- npm run gate:aiboux が AIBOUX_GATE_PASS
- Bark送信なし
- resetなし
- cleanなし
- force pushなし
- 削除なし
- secret表示なし

公開m68が短縮版、英語版、概要版、URL移行だけの本文なら完了報告禁止。

以上です。
これをマスターに入れれば、rirekisho、docs、mall、file、biz、officeを落とす事故は止められます。
