# 2_UIフィードバック_A_dash

**レビュー対象**: AIBOUX Mail 最新UI変更（2026-05-27 実施のフローティング化・不要情報削除・ヘッダー統合スプリント）  
**レビュー日時**: 2026-05-28  
**レビュー主体**: Grok 4.3 (xAI)  
**根拠資料**:
- `docs/AIBOUX_MASTER_SPEC.md`
- `docs/AIBOUX_SERVICE_MAP.md`
- `docs/AIBOUX_UI_DESIGN_SYSTEM.md`
- `docs/AIBOUX_AI_ASSISTANT_SPEC.md`
- `docs/AIBOUX_DEVELOPMENT_HANDOFF.md`
- `all_log/1_UI改善ログ_A.md`（変更内容の一次記録）
- 現行ソースコード（`src/components/mail/*`, `src/components/ai/MailAIAssistantPanel.tsx`, `src/layouts/MailLayout.astro`, `src/styles/global.css` など）
- スクリーンショット: `test-results/mail-ui-sprint-desktop-*.png`, `mail-ui-sprint-mobile-*.png`
- ビルド検証: `npm run build` 成功

---

## 1. 変更概要（1_UI改善ログ_A.md より抽出）

- AI Assistant を右固定カラム / Bottom Sheet から、右下FAB起動の**フローティングウィンドウ**へ統一（初期状態は閉じ、右下アイコン常駐）。
- デスクトップ/モバイルともに AI ウィンドウはデフォルト非表示。
- iPhone 想定で `env(safe-area-inset-*)` + `100dvh` 対応。
- フォントを Inter Variable 優先へ変更。
- **不要情報削除**:
  - AI パネルから「抽出結果」「解析進行」「番号/金額/期日系表示」を全削除。
  - 要約を「番号・金額・期日を含まない汎用確認サマリー」へ変更。
  - メール詳細から業務抽出カード、Core候補接続、関連バッジを削除。
  - 添付ファイルカードの状態ラベル削除 → アイコンボタン + Tooltip のみに。
- **ヘッダー統合**:
  - 左サイドバー下部の設定/ヘルプを削除。
  - 右上ヘッダー（MailTopbar）に設定ボタン + ヘルプメニューを統合。
- アプリ切替・通知・ヘルプ・返信/転送・ツールバー追加操作に toast 等の反応を追加。
- ComposeDialog / TemplateManager から番号/金額/支払期限の抽出訴求を削除。

**変更ファイル（ログ記載）**:
- `src/components/mail/MailClientShell.tsx`
- `src/components/ai/MailAIAssistantPanel.tsx`
- `src/components/mail/MailSidebar.tsx`
- `src/components/mail/MailTopbar.tsx`
- `src/components/mail/MailThreadView.tsx`
- `src/components/mail/MailThreadHeader.tsx`
- `src/components/mail/MailAttachmentCard.tsx`
- `src/components/mail/MailToolbar.tsx`
- `src/components/mail/ComposeDialog.tsx`
- `src/components/mail/TemplateManager.tsx`
- `src/styles/global.css`
- `package.json`（フォント）

---

## 2. 仕様書との整合性評価（AGENTS.md 必須）

### 2.1 明確な不整合（High 重要度）

**AI Assistant の配置方針**

- `docs/AIBOUX_AI_ASSISTANT_SPEC.md:7`: 「Core / Mail / Shop では右カラムAI Assistantを常設する。」
- `docs/AIBOUX_MASTER_SPEC.md:74,92`: 「右AI Assistant常設。」（Mail セクション）
- `docs/AIBOUX_MASTER_SPEC.md:89`: 「Gmail風だがCoreの密度と白背景に統一」

**現行実装**:
- `MailClientShell.tsx:271-275`: `<MailAIAssistantPanel open={aiOpen} ... />` を常にレンダー。`aiOpen` 初期値 `false`。
- `MailClientShell.tsx:276-285`: `!aiOpen` のときのみ右下 fixed FAB（Bot アイコン）で開く。
- `MailAIAssistantPanel.tsx:32-44`: `fixed z-50` + 全方向 `env(safe-area-inset-*)` インセット。`sm:` で 420px 右下アンカー。
- Desktop では**右固定カラムは存在しない**。常に overlay の floating ウィンドウ。

**結論**: 「フローティング化」は「右カラム常設」という明示要件に**直接抵触**する。仕様書が更新されていないため、設計方針の破綻とみなす。

`docs/AIBOUX_DEVELOPMENT_HANDOFF.md:89` には「旧固定右カラムAIは廃止し、右下フローティングUI + FAB復帰に統一」とあるが、これは MASTER / AI_ASSISTANT_SPEC と矛盾。仕様更新が未実施。

### 2.2 UI 設計システムとの整合（良好）

- `docs/AIBOUX_UI_DESIGN_SYSTEM.md:7-13`: Light mode only、白背景、細い border、shadcn/ui（Mail）、高密度（余白20%削減）、小さい `MAIL` badge、小文字 `aiboux` のみ、過剰 shadow / 紫グラデ / ガラス風禁止。
- 現行コード:
  - `global.css:4-9`: Inter Variable 優先 + Geist フォールバック（スプリント通り）。
  - すべての Card / Button: `shadow-none` または `shadow-sm`、`border-neutral-200`、`p-3`、`h-8`、`text-xs` 中心 → 高密度維持。
  - SidebarHeader: `aiboux` ロゴ + `MAIL` badge（小文字ロゴ + サービス別大文字 badge 規則遵守）。
  - 紫グラデ・過剰装飾・ダークモード: 一切なし。

**評価**: UI トークン・密度・ロゴ規則は**良好に維持**されている。

### 2.3 不要情報削除の完全性

`src/` 全体で以下の文字列を grep（大文字小文字無視）:
- 「抽出結果」「Core候補」「業務情報抽出」「請求書番号を自動抽出」「注文番号を自動抽出」「請求関連を抽出」「金額.*抽出」「期日.*抽出」

**結果**: 0 件ヒット。

- `MailAIAssistantPanel.tsx`: 進捗バー・抽出カード・金額/期日表示は完全に除去。残存するのは「現在のメール」（件名・差出人・添付数 + 公私バッジ）、「要約」（汎用）、「音声返信メモ」、「クイックアクション」のみ。
- `MailThreadView.tsx` / `MailThreadHeader.tsx`: 業務抽出カード・Core候補ボタン・関連バッジは存在しない。
- `MailAttachmentCard.tsx:34-54`: 状態ラベル完全削除。アイコン + Tooltip「開く」のみ。
- `ComposeDialog.tsx` / `TemplateManager.tsx`: 抽出訴求 UI は除去済み（ログ主張通り）。

**評価**: 「不要情報削除」は**完全**。視覚的にもスクリーンショット上で一切確認できない。

---

## 3. ヘッダー統合の確認

- `MailSidebar.tsx:117-122`: SidebarFooter は「mail.aiboux.com / Kenjiro Sato / premium_980」の表示のみ。設定・ヘルプボタンは**存在しない**。
- `MailTopbar.tsx:144-151`: 歯車アイコン（Settings）→ `onMailboxChange("settings")` で設定画面へ遷移。
- `MailTopbar.tsx:153-171`: HelpCircle ドロップダウン（ヘルプセンター / ショートカット / 問い合わせ）。
- Topbar 内に AI 起動（Bot）、アプリ切替、通知、設定、ヘルプが統合済み。

**評価**: サイドバー下部からの完全撤去 + ヘッダー統合は**実装通り**。冗長な UI は解消。

---

## 4. 不自然な挙動・デザイン破綻の指摘

### 4.1 High 重要度

**1. AI フローティングパネルの Desktop におけるオーバーレイ問題**
- `MailAIAssistantPanel.tsx:35-40`: Desktop（sm:）でも `fixed` + 右下アンカー。ワークスペースを**一切押し出さない**。
- スクリーンショット `mail-ui-sprint-desktop-ai-open.png` 確認: AI パネル（幅420px想定）がスレッドビュー右側を大幅に覆っている。1440px 幅でもスレッド本文の一部が隠れる状態。
- 従来の「右カラム常設」では 3 ペインが同時に表示されていたが、現在は AI 開時に**スレッドが読めなくなる**。
- ディムやワークスペース圧縮の仕組みは一切ない。

**2. 2 つの fixed z-50 要素の衝突リスク**
- `MailAIAssistantPanel.tsx:32`: メイン AI パネル `fixed z-50`
- 同ファイル `328-348`: `voiceDraft` 承認カードも `fixed z-50` で右下配置。
- 音声メモ → 下書き化 → 承認カード表示の流れで、メイン AI パネルが開いたままになると**2 つの白背景パネルが重なる**。
- スクリーンショット上では未再現だが、コード上は同時に表示可能。

**3. 仕様と実装の根本矛盾（再掲）**
- 「常設」要件を破棄した設計変更が、MASTER_SPEC / AI_ASSISTANT_SPEC に反映されていない。
- これは「UI 改善」ではなく「UI 方針変更」であり、仕様更新なしでの実装は AGENTS.md 違反に該当するリスク。

### 4.2 Medium 重要度

**4. モバイル時 Toaster の隠蔽**
- `MailClientShell.tsx:288`: `<Toaster position="top-right" />`
- モバイル AI シートはほぼ全画面（safe-area 10px インセット）。Top-right の toast は AI シート背後に完全に隠れる。
- 音声入力エラーなどは `toast.error` で出るため、モバイルで確認不能になる可能性。

**5. Topbar フィルタボタンが依然として非機能**
- `MailTopbar.tsx:94-100`: 「未読」「添付あり」「重要」「返信待ち」ボタンが Popover 内に静的レンダーのみ。onClick・状態連動・実際のフィルタロジックが一切存在しない。
- 2_フィードバック_A_dash.md（前回）で既に指摘済みだが未修正。

**6. ブランド表記の軽微な重複**
- Topbar `59-61行`: `md:` で "Mail" テキスト表示。
- SidebarHeader: `aiboux` + `MAIL` badge。
- 同一ビュー内で「Mail」と「aiboux MAIL」が同時に目に入る。

### 4.3 Low / Info

**7. Safe-area 計算の Desktop 適用**
- すべての `calc(env(safe-area-inset-*))` が Desktop でも評価される（sm: で上書きされるが、根本的にモバイル前提の式）。
- 実害は小さいが、将来的なブラウザ差異の温床。

**8. スクリーンショット上の視覚的問題（なし）**
- 4 枚の sprint スクリーンショットを multimodal で確認:
  - Desktop initial: 3 ペイン密度・罫線・余白・FAB 配置に破綻なし。
  - Desktop AI open: オーバーレイによる隠蔽は確認できるが、**パネル内部の崩れ・クリッピング・過剰余白・コントラスト不足は一切なし**。
  - Mobile initial / AI open: safe-area 考慮で上下に余裕があり、内容が切れていない。FAB 位置・シート高さともに良好。
- ロゴ・バッジ・フォント・アイコン・ボタン反応の視覚的破綻は確認されなかった。

---

## 5. 肯定的評価

- **不要情報削除の徹底度**: 文字列レベル・UI レベル・スクリーンショットレベルの三重確認で完全。
- **高密度 UI の維持**: p-3 / h-8 / text-xs / gap-2-3 のトーンが全画面で一貫。Notion 風白背景 + 細い罫線も維持。
- **操作反応の追加**: ログ記載の「見た目だけのボタン削減」は概ね達成（archive/delete/read/star/compose などで toast 確認）。
- **iOS 対応**: `100dvh` + `env(safe-area-inset-*)` の組み合わせはモバイル AI シート・FAB で正しく機能（スクリーンショット実測で viewport 内収まり確認済み）。
- **ビルド健全性**: `npm run build` 成功（Server built in 37.09s）。Mail React Islands + shadcn + 音声 API のトランスパイルに問題なし。

---

## 6. 残存する未完了・注意点（AGENTS.md 準拠）

- **仕様更新未実施**: フローティング化に伴う「常設」要件の撤回・再定義が MASTER_SPEC / AI_ASSISTANT_SPEC / UI_DESIGN_SYSTEM / DEVELOPMENT_HANDOFF に一切反映されていない。
- **実機 iPhone 17 Safari 検証**: Dynamic Island、アドレスバー伸縮、ソフトキーボード表示時の最終 safe-area 挙動は未実施（ログでも明記）。
- **フィルタ機能**: Topbar 内のフィルタボタンは依然としてモック。
- **voiceDraft 承認カードの z-index 管理**: メイン AI と同時に開いた場合の重なり対策が未実装。
- **Desktop AI 開時のワークスペース扱い**: オーバーレイか、圧縮表示か、ディム付きモーダルかの設計判断が未確定。
- **Toaster 位置**: モバイル AI 開時の通知表示方法（inline 化 or 位置変更）の検討が必要。

---

## 7. 推奨アクション（優先度順）

1. **最優先**: MASTER_SPEC / AI_ASSISTANT_SPEC を更新し、Mail の AI 配置方針を「右下フローティング + FAB（デフォルト閉）」に正式変更。あるいは「常設」を維持して inline 右カラムを復活。
2. voiceDraft 承認カードをメイン AI パネル内部に統合（または z-index を明確に分離）。
3. モバイル時の toast を inline ステータス表示に統一（または AI シート下部に専用通知エリア）。
4. Topbar フィルタボタンに実際のフィルタロジックを接続（または削除）。
5. Desktop AI 開時に軽いディム + クリックで閉じられる挙動を追加（オーバーレイ感の軽減）。
6. 実機 iPhone 17 Safari で最終 safe-area + キーボード検証を実施し、証跡を 3_最終UI完了ログ に追記。
7. スクリーンショット比較（変更前後）を `test-results/` に追加し、視覚的回帰を明文化。

---

## 8. 検証実行記録

- **ビルド**: `npm run build` → `[build] Complete!`（Server built 37.09s）。エラー0。
- **抽出文字列 grep**: src/ 全体で 0 件。
- **スクリーンショット視覚確認**: 4 枚すべて multimodal 読込済み。パネル内部崩れ・クリッピング・過剰余白は確認されず。オーバーレイ隠蔽のみ設計上の指摘。
- **コード行数参照**: MailClientShell 253-292行、MailAIAssistantPanel 32-44行 / 328-348行、MailTopbar 144-171行、MailSidebar 117-122行 など。

---

## 9. 総評

「不要情報削除」と「ヘッダー統合」は**仕様通り・高品質に完了**している。  
しかし「フローティング化」は、MASTER_SPEC / AI_ASSISTANT_SPEC が定める「右AI Assistant常設」という根本要件と**正面から衝突**しており、現時点では「UI 改善」ではなく「未合意の UI 方針変更」と評価せざるを得ない。

視覚的な破綻（崩れ・クリッピング・コントラスト不良）は現時点で発見されなかったが、**Desktop での AI 開時オーバーレイによる情報隠蔽**と**2 つの fixed パネルの z-index 衝突リスク**は、ユーザ体験上の不自然さとして早急な設計判断を要する。

AGENTS.md 遵守のため、本フィードバックを基に仕様更新または設計是正を実施した上で、3_最終UI完了ログ_A2_dash.md を更新することを強く推奨する。

---

**出力ファイル**: `/home/pkkatsu/aiboux/all_log/2_UIフィードバック_A_dash.md`（本ファイル）  
**完了報告**: 24時間限定公開URL としての証跡は別途ユーザ指示により発行可能。ビルド成功・スクリーンショット読込・grep 0件のエビデンスは本ファイル内に含む。
