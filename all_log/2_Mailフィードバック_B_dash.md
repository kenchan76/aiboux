# 2_Mailフィードバック_B_dash

**レビュー対象**: AIBOUX Mail 最新UIブラッシュアップ（1_MailUI微調整_B.md 実装分）  
**対象変更**: リスト件名拡張（1行でsubject + snippetプレビュー）、余白調整（pr-1.5）、AI起動FAB強調（size-14 青背景+重shadow）、AI AssistantパネルへのNotion風＋未来感のある青系グラデーション/ border/ring/ shadow追加  
**レビュー日時**: 2026-05-28  
**レビュー主体**: Grok 4.3 (xAI)  
**根拠資料**:
- `AGENTS.md`（必須読込）
- `docs/AIBOUX_MASTER_SPEC.md`
- `docs/AIBOUX_SERVICE_MAP.md`
- `docs/AIBOUX_UI_DESIGN_SYSTEM.md`
- `docs/AIBOUX_AI_ASSISTANT_SPEC.md`
- `all_log/1_MailUI微調整_B.md`（変更の自己申告）
- `all_log/2_Mailフィードバック_A_dash.md`（前回指摘との連続性）
- 現行ソースコード（`src/components/mail/MailListItem.tsx`、`src/components/ai/MailAIAssistantPanel.tsx`、`src/components/mail/MailClientShell.tsx`、`src/components/mail/MailList.tsx`、`src/components/mail/MailTopbar.tsx`、`src/layouts/MailLayout.astro`、`src/styles/global.css`、`src/data/mail-sample-data.ts`）
- スクリーンショット: `test-results/mail-ui-b-compact-list.png`、`test-results/mail-ui-b-ai-panel.png`、`test-results/mail-ui-b-mobile-ai.png`（他 mail-ui-sprint-* も参考）
- ビルド検証: `npm run build` 成功（Server built in 39.43s、エラー0）
- 静的検査: `dark:` / `Starwind` / `starwind` が Mail/AI/Mail配下で0件
- grep: bg-gradient / shadow-\[ / blue-50/60 / ring-blue-100 がAIパネル+FABに限定されていることを確認

**注意**: 本リポジトリに `AIBOUX_MAIL_SPEC.md` は存在しない。評価は MASTER_SPEC / SERVICE_MAP / UI_DESIGN_SYSTEM / AI_ASSISTANT_SPEC を Source of Truth として実施。未確定は推測せずTBD扱い。AGENTS.md の「仕様書にない機能を「実装済み」と言わない」「UI方針変更時は docs/ 引継書更新必須」を厳守して評価。

---

## 1. 変更概要（1_MailUI微調整_B.md + コード実体）

- PC版 compact 表示（1行リスト）で **件名右側に本文プレビュー（snippet）を1行追加**（`MailListItem.tsx:71-74`）。
  - sender列: `basis-[clamp(8rem,18vw,15rem)]`
  - subject: `max-w-[44%] shrink truncate`
  - snippet: `flex-1 truncate text-xs text-neutral-500`
  - 区切り: `text-neutral-300` の " - "
  - 日時: `w-16 pr-1.5`（約6px右余白追加）
- AI起動FAB: `size-14`（56px）に拡大、青背景（`bg-blue-600`）、重い青系shadow（`shadow-[0_14px_34px_rgba(37,99,235,0.28)]`）、白アイコン + Tooltip（`MailClientShell.tsx:290-301`）。
- AI Assistantパネル（右下フローティング）へ以下の「Notion風＋未来感」装飾を追加（`MailAIAssistantPanel.tsx` 全体、特に36-40行、184行、337行）:
  - パネル外枠: `bg-gradient-to-b from-sky-50/80 via-white to-white` + `shadow-[0_24px_70px_rgba(15,23,42,0.18)]` + `ring-1 ring-blue-100/70` + 複数 `border-blue-100`
  - ヘッダー: `bg-white/80 border-blue-100`
  - カード群: `border-blue-100/80 bg-white/90`
  - クイックアクション: `border-blue-100 bg-white/90 hover:bg-blue-50`
  - 音声メモTextarea: `border-blue-100` + `focus-visible:border-blue-500 focus-visible:ring-blue-100`
  - 入力エリア: `border-blue-200` + `shadow-inner shadow-blue-50/70` + `focus-visible:border-blue-600` + 下部バー `bg-gradient-to-b from-white to-blue-50/60`
  - ヘッダーアイコン: `bg-blue-600 text-white shadow-sm`
- 自己申告: 「白基調を保った薄い青系アクセント」「紫グラデ・暗色・過剰装飾は使用していない」「Notion風ルールを崩さないため限定した」と主張。

**主な変更ファイル（実コード確認済み）**:
- `src/components/mail/MailListItem.tsx:67-87`（compact 1行拡張 + pr-1.5）
- `src/components/ai/MailAIAssistantPanel.tsx:32-44,184,337-360`（グラデ + 影 + blue系全域）
- `src/components/mail/MailClientShell.tsx:282-301`（FAB + パネル配置）
- 既存の分割/compact切替機構はそのまま再利用

---

## 2. 仕様整合性評価

### 2.1 良好に実装されている点（ローカルUIは綺麗）

- 1行リストの件名+snippet拡張は技術的には正しく flex + truncate で実装されており、PC 1440px幅では綺麗に1行収まっている（スクリーンショット確認）。
- pr-1.5 の右余白追加は意図通り機能（日時列が端に張り付かない）。
- FABの視認性向上自体は操作性向上として一定の効果あり。
- Light-only、shadcn/ui純粋使用、Starwind完全排除、ビルド成功は継続。
- モバイルAIパネルは safe-area 計算で画面内に収まっている（以前の指摘対応済み）。

### 2.2 明確なデザイン破綻・操作性問題（High / Medium / Low）

#### High 重要度（AGENTS.md / UI_DESIGN_SYSTEM 直接抵触・即是正必須）

**1. AIパネルに「未来感のあるAI背景」を追加したことで、厳禁の「AI っぽい装飾」「グラデーション」「過剰shadow」が導入された（根本違反）**

- `MailAIAssistantPanel.tsx:36`:
  ```tsx
  "bg-gradient-to-b from-sky-50/80 via-white to-white ... shadow-[0_24px_70px_rgba(15,23,42,0.18)] ring-1 ring-blue-100/70"
  ```
- 底部: `bg-gradient-to-b from-white to-blue-50/60`（337行）
- 内部カード/入力: 複数 `border-blue-100/80` + `bg-white/80-90` + `shadow-inner shadow-blue-50/70` + 青 focus ring 全域
- **AGENTS.md 直接引用**: 「紫グラデーション、ガラス風 UI、AI っぽい装飾、過剰な shadow、過剰な角丸は禁止。」
- **UI_DESIGN_SYSTEM 直接引用**: 「shadow `shadow-sm` only when needed」「紫グラデ・過剰shadow・ガラス風なし」「AIっぽい装飾禁止」「background #FFFFFF」「border neutral-200」
- **MASTER_SPEC**: 「Gmail風だがCoreの密度と白背景に統一」
- 影響: スクリーンショット `mail-ui-b-ai-panel.png` で、純白のNotion風リスト領域に対して右側パネルだけが明らかに青みがかかり、グラデ+重影+青リングで浮いている。長時間業務メール処理で「疲れないUI」という最優先事項に反する。`mail-ui-b-mobile-ai.png` ではさらにフル画面で青 tint のカード群が目立ち、スタイルが完全に別アプリのように見える。
- 自己申告の「薄い青系で限定した」は、ルール上「AIっぽい装飾を少しだけ入れる」という解釈自体が禁止事項に抵触。

**2. AI起動FABの「強調」が静かな高密度UI全体のトーンを破壊**

- `MailClientShell.tsx:291`:
  ```tsx
  className="fixed z-40 size-14 rounded-full border border-blue-500 bg-blue-600 p-0 text-white shadow-[0_14px_34px_rgba(37,99,235,0.28)] ... focus-visible:ring-4 focus-visible:ring-blue-200"
  ```
- サイズ56px + 青背景 + 大型青影 + 青リングは、Mail内の他のどの要素（ツールバー、ボタン、バッジ）よりも強く主張する。
- **UI_DESIGN_SYSTEM**: Mailアクセントは「restrained blue」。過剰強調は「長時間使って疲れないUIを優先する」に反する。
- スクリーンショットでもリスト右下に強烈な青丸が目立ち、業務集中を阻害する可能性が高い。

**3. 左上ブランディングはAレビューで修正済みだが、AI装飾追加で全体の一貫性が再び崩れた**

- 前回指摘で `aiboux MAIL` テキスト+バッジに修正されたが、AI領域だけが「未来感」装飾で突出したことで、シェル全体のNotion風トーンが損なわれた。

#### Medium 重要度（操作性・視認性問題）

**4. 1行リストの「件名拡張」が逆効果（件名スキャン性の低下）**

- `MailListItem.tsx:72`:
  ```tsx
  <span className="min-w-0 max-w-[44%] shrink truncate ...">{message.subject}</span>
  <span className="shrink-0 text-xs text-neutral-300">-</span>
  <span className="min-w-0 flex-1 truncate text-xs text-neutral-500">{message.snippet}</span>
  ```
- スクリーンショット `mail-ui-b-compact-list.png` で確認: 長い件名（特にRe:スレッド）は44%で強制的に切れ、"-" を挟んでsnippetが続くため、**どこまでが本当の件名か一瞬で判断しにくい**。
- 業務メール処理で最も重要な「件名による高速スキャン」が、snippet追加によってかえって阻害されている。
- 日本語長文スレッドで特に顕著。`max-w-[44%]` は硬直的で、viewport幅変動時の視認性劣化が予想される。

**5. AIパネルが本文/リストを隠蔽する根本問題が継続（A_dash指摘の残存）**

- 右下 fixed z-50、pushもdimもなし。
- デスクトップでAIを開くと、リスト右側が青 tint パネルに視覚的に競合・一部隠れる。
- スクロール修正や1行リストの恩恵を、AI使用時に台無しにしている。

**6. カード乱用 + ネストされた青ボーダーがNotion風高密度を損なう**

- AIパネル内に Card が3つ以上（現在のメール、要約、音声返信メモ） + グラデコンテナ。
- **UI_DESIGN_SYSTEM**: 「意味のないカード乱用は禁止」「細い罫線、高密度」
- 結果として情報階層が重くなり、コンパクトなメール業務UIに不向き。

#### Low / Info

**7. モバイルでのスタイル乖離が大きい**

- モバイルAIはほぼフル画面の青 tint UI。リスト（白）→ AI（青グラデ）の切り替えで認知負荷が高い。

**8. 仕様書更新の完全欠如（プロセス違反）**

- 今回の「未来感AI背景」追加はUI方針の明確な変更だが、`docs/AIBOUX_UI_DESIGN_SYSTEM.md`、`docs/AIBOUX_MASTER_SPEC.md`、`docs/AIBOUX_AI_ASSISTANT_SPEC.md` のいずれも更新されていない。
- AGENTS.md 違反。

**9. 余白調整の非対称性**

- 左（checkbox/star領域）と右（pr-1.5）の呼吸感が不均衡。コンパクト行全体の視覚的安定感をやや損なっている。

---

## 3. 検証実行記録

- **必須ドキュメント**: AGENTS.md、MASTER_SPEC、SERVICE_MAP、UI_DESIGN_SYSTEM、AI_ASSISTANT_SPEC を全文読込。
- **コード網羅読込**: MailListItem（全）、MailAIAssistantPanel（全）、MailClientShell（全）、MailList、MailTopbar、MailLayout、global.css（関連部）。
- **Grep検証**:
  - `dark:` / Starwind → Mail/AI配下 0件（ポリシー遵守）。
  - bg-gradient / shadow-\[ / blue-50/60 / ring-blue → AIパネル + FAB の2ファイルに限定（意図的追加を確認）。
- **ビルド**: `npm run build` → 成功（エラー0、39.43s）。
- **スクリーンショット検査**（read_file + 視覚解析）:
  - `mail-ui-b-compact-list.png`: 1行subject+snippetの実際の見た目、44%切れ、"-"区切り、pr-1.5を確認。
  - `mail-ui-b-ai-panel.png`: グラデ+青border+重影の見た目、リストとのコントラスト差を確認。
  - `mail-ui-b-mobile-ai.png`: モバイルでの青 tint フルパネルを確認。
- **画像証拠**: すべて test-results/ に保存済み。

---

## 4. 肯定的評価

- 1行リストの技術的拡張と右余白追加は、**意図した高密度化**としては綺麗にできている。
- FABのサイズ拡大自体は発見性を高めている。
- ビルド健全性、UIライブラリポリシー、Light-onlyは継続良好。

---

## 5. 残存未完了・TBD（AGENTS.md 準拠）

- **High**: AIパネルの青グラデ/重影/青アクセント全廃 + 純白neutral細線ベースへの完全回帰（または仕様変更承認）。
- **High**: FABの強調レベルを「restrained blue」+ `shadow-sm` 以内に抑制。
- 1行リストの subject/snippet 比率と区切り表現の再設計（44%硬直は不適）。
- AIパネルの表示方式（オーバーレイ vs 押し出し or 右カラム常設）の根本方針を MASTER / AI_ASSISTANT_SPEC と整合させる。
- `docs/` 3ファイルへのUI変更反映（今回のブラッシュアップは明確な方針変更）。
- 実機長時間使用での眼精疲労テスト（青 tint + 重影の影響）。
- コンパクト表示での日本語長スレッド実データでの視認性最終検証。

**結論**: 今回の「Notion風＋未来感のあるAI背景」ブラッシュアップは、**デザイン破綻と操作性低下を複数引き起こしている**。AGENTS.md のUI原則に明確に抵触するため、早急な是正（または公式仕様変更）を推奨する。ファイルは要求通り生成した。

---
*本フィードバックは `all_log/2_Mailフィードバック_B_dash.md` として永続保存。24時間限定公開URL発行手順は別途 AGENT_RULES.md に従い実施。*
