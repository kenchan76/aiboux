# AIBOUX Core 見積書・注文書 UI 納品書基準横展開

## Status

CODE_READY

## User Goal

納品書で作った一覧・詳細・作成・編集UIの動作、CSS、レイアウトを、見積書と注文書へ横展開する。納品書を今回のUI基準テンプレートとする。

## Target Screens

- 見積書一覧
- 見積書詳細
- 見積書作成
- 見積書編集
- 注文書一覧
- 注文書詳細
- 注文書作成
- 注文書編集

## Reference Screens

- 納品書一覧
- 納品書詳細
- 納品書作成
- 納品書編集
- 納品書のモーダル、ウィンドウ、パネル動作
- 納品書のCSS、余白、一覧表、ヘッダー、詳細レイアウト、作成フォーム、保存/閉じる/キャンセル/一覧更新動作

## Explicitly Out Of Scope

- 請求書は変更しない。
- 受注画面は、ユーザーが言う注文書と同一でない限り変更しない。
- API、DBスキーマ、既存ID作成ロジックは不要に変更しない。
- デプロイ、push、Bark送信は行わない。

## Required Behavior

- 一覧から新規作成を押してもページ遷移せず、納品書作成と同じ形式の作成ウィンドウを開く。
- 一覧から行クリックまたは詳細ボタンを押してもページ遷移せず、納品書詳細と同じ形式の詳細ウィンドウを開く。
- 詳細から編集する場合もページ遷移せず、納品書と同じ形式で編集する。
- 保存後は一覧を再取得または状態更新する。
- キャンセル/閉じるで一覧に戻る。ただし画面遷移ではなくウィンドウを閉じる。
- ブラウザ履歴を無駄に増やさない。
- `window.location.href`、強制reload、不要な`Navigate`、不要な`router.push`は禁止。
- 既存データ、ID、tenant_id、document_id、estimate_id、order_idを作り直さない。

## CSS / Layout Requirements

- 納品書UIで使っているCSS class、共通コンポーネント、layout wrapper、modal/drawer/panel構造を調査する。
- 見積書と注文書に新しいバラバラのCSSを作らない。
- 可能な限り納品書と同じ共通class、共通layout、共通componentを使う。
- 余白、行間、フォントサイズ、見出しサイズ、罫線、背景色、カード幅、テーブル高さ、ボタンサイズ、ボタン位置を納品書に揃える。
- 作成ウィンドウの幅、高さ、最大幅、スクロール挙動、ヘッダー固定、フッター固定、保存ボタン位置を納品書に揃える。
- 詳細ウィンドウの幅、高さ、情報ブロック、明細テーブル、合計欄、操作ボタンを納品書に揃える。
- 一覧テーブルの列幅、行高さ、hover、選択状態、アクションボタン位置を納品書に揃える。
- スマホ/狭幅画面でも納品書と同じレスポンシブ方針にする。
- inline styleを増やさない。既存CSS変数、既存class、共通コンポーネントを優先する。
- UI差異が必要な場合は `all_log` に記録する。

## Required Investigation

- `AIBOUX_MASTER_DOCUMENT.md` を読む。
- `ops/instructions/current.md` を読む。
- 納品書関連の一覧・詳細・作成ファイルを特定する。
- 見積書関連ファイルを特定する。
- 注文書関連ファイルを特定し、受注ではなく注文書/発注書に該当する既存画面を確認する。
- 納品書のCSS、共通コンポーネント、layout class、modal/drawer構造を確認する。
- 見積書・注文書が納品書と違うCSS/レイアウトになっている箇所を一覧化する。

## Required Verification

- `npm run check:control-chars`
- `npm run check:mojibake`
- `npm run gate:aiboux`
- `ESBUILD_WORKER_THREADS=0 npm run build`
- 可能ならPlaywrightまたは既存テストで、納品書/見積書/注文書の一覧、作成、詳細、編集ウィンドウ動作を確認する。
- 可能ならスクリーンショット比較を取得する。
- 請求書が変更されていない証跡を残す。

## Required Evidence

- `all_log` に調査、実装、CSS比較、検証結果を保存する。
- 変更ファイル一覧を報告する。
- 見積書、注文書、納品書、請求書それぞれの影響有無を報告する。

## Prohibited Actions

- 請求書を変更しない。
- `git reset --hard` を実行しない。
- `git clean -fd` または `git clean -fdx` を実行しない。
- `rm -rf` を実行しない。
- force pushしない。
- Barkを送信しない。
- secret/PAT/API key/tokenを表示しない。
- 未追跡ファイルを削除しない。
- tracked source/config diffを勝手にrevertしない。
- source/configの不要な大規模変更をしない。
- 見積書と注文書だけ独自CSSでバラバラにしない。
- 画面遷移で作成画面へ飛ばさない。
