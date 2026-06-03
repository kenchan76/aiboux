# 2_UIフィードバック_C_dash

**レビュー対象**: AIBOUX Mail AI Assistantウィンドウ背景の『未来色（コズミック・グラデーション/すりガラス/glow edge）』変更  
**レビュー日時**: 2026-05-28  
**レビュー主体**: Grok 4.3 (xAI)  
**根拠資料**:
- `AGENTS.md`（必須読込）
- `docs/AIBOUX_MASTER_SPEC.md`
- `docs/AIBOUX_SERVICE_MAP.md`
- `docs/AIBOUX_UI_DESIGN_SYSTEM.md`
- `docs/AIBOUX_AI_ASSISTANT_SPEC.md`
- `all_log/1_MailUI微調整_B.md`
- `all_log/1_UIリベンジログ_C.md`（変更の自己申告・意図明記）
- `all_log/2_Mailフィードバック_B_dash.md`（前回指摘の連続性）
- 現行ソースコード（`src/components/ai/MailAIAssistantPanel.tsx:36`, `src/styles/global.css:106-168`）
- スクリーンショット: `test-results/mail-ui-c-local-ai-panel.png`, `test-results/mail-ui-c-local-mobile-ai.png`（他 `mail-ui-b-*` も比較参照）
- ビルド検証: `npm run build` 成功（Server built 39.43s、エラー0、1_UIリベンジログ_C.md 自己検証より）

**注意**: 本リポジトリに `AIBOUX_MAIL_SPEC.md` は存在しない。評価は MASTER_SPEC / SERVICE_MAP / UI_DESIGN_SYSTEM / AI_ASSISTANT_SPEC を Source of Truth として実施。未確定は推測せずTBD扱い。AGENTS.md の「仕様書にない機能を「実装済み」と言わない」「UI方針変更時は docs/ 引継書更新必須」を厳守して評価。

---

## 1. 変更概要（1_UIリベンジログ_C.md + 実コードより抽出）

- AI Assistantパネル（右下フローティング）の外装を、従来の白/薄青系から「未来感のあるコズミック表現」へ全面変更。
- 実装: `MailAIAssistantPanel.tsx:36` でルート要素に `mail-ai-cosmic-panel` クラスを適用。
- 背景: ティール・深い青緑・アメジスト・パープルの複合グラデーション + 18s 周期の位置アニメーション。
- すりガラス: `backdrop-filter: blur(18px) saturate(150%)` を明示的に適用。
- glow edge: `::before` による多色（シアン→白→バイオレット→ティール）の1pxパディンググロー + `::after` によるシマーと光点スパークル。
- ヘッダー: 暗色半透明面 + 白/シアン文字。
- 内部コンテンツ: カード群を `bg-white/95` で部分的に白背景化し、文字視認性を「確保」しようとする妥協設計。
- 自己申告（1_UIリベンジログ_C.md:66-67）:
  > 「前回Grokレビューで抑えた白基調ルールを今回はユーザー明示指示により一時的に棚上げし...」
  > 「AGENTS.md / docs/AIBOUX_UI_DESIGN_SYSTEM.md の「白基調」「紫グラデーション禁止」「ガラス風禁止」と意図的に衝突する。これはユーザーの明示指示に基づく例外扱い。」
  > 「Grokレビュー後は、文字が読めない、入力欄が分かりづらい、画面外にはみ出す等の実用性問題のみ修正対象とする。」

**主な変更ファイル**:
- `src/styles/global.css:106-168`（`@keyframes mail-ai-cosmic-shift` + `.mail-ai-cosmic-panel` および疑似要素）
- `src/components/ai/MailAIAssistantPanel.tsx:36`（クラス適用）

**文脈**: 1_MailUI微調整_B.md で既に「薄い青系グラデ」を追加した時点で 2_Mailフィードバック_B_dash.md が High 重要度で厳しく指摘済み。それをさらに「リベンジ」としてエスカレートさせたのが本変更。

---

## 2. 仕様書との整合性評価（AGENTS.md 必須）

### 2.1 明確な不整合（High 重要度・即是正必須）

**1. AGENTS.md Global UI Rules 直接抵触（最重要違反）**

AGENTS.md 78-86行:
> 「Light mode only。ダークモードは禁止。Notion風の白背景、細い罫線、高密度 UI。...紫グラデーション、ガラス風 UI、AI っぽい装飾、過剰な shadow、過剰な角丸は禁止。」

現行実装:
- `global.css:121-124`: ティール・紫・暗青緑の3層グラデーション（linear-gradient 135deg + 2 radial）。
- `global.css:131-132`: `backdrop-filter: blur(18px) saturate(150%)` — 文字通りの「すりガラス」。
- `global.css:127-130`: ティール/パープル発光を含む box-shadow。
- `global.css:142-154`: ::before による虹色 glow edge（cyan → white → violet → teal）。
- `global.css:162-167`: ::after による shimmer + sparkle dots。
- 18s ease-in-out infinite の background-position アニメーション。

**結論**: 「未来色（コズミック・グラデーション/すりガラス/glow edge）」は、AGENTS.md が**明示的に禁止した4要素（紫グラデ系 + ガラス風 + AIっぽい装飾 + 過剰shadow/アニメーション）**をすべて満たす。違反は「薄い青系アクセント程度」ではなく、意図的・全面的・アニメーション付き。

**2. AIBOUX_UI_DESIGN_SYSTEM.md 直接抵触**

UI_DESIGN_SYSTEM.md 7-13行, 31-36行:
> 「Light mode only。背景は白中心。Notion風の静かなUI。...Do Not Invent: ダークモードを入れない。AIっぽい紫グラデーション、ガラス風、過剰shadowを使わない。」

同 43-50行（Global Tokens）:
> 「background | `#FFFFFF`」「border | `neutral-200`」「shadow | `shadow-sm` only when needed」

現行:
- 背景は #FFFFFF ではなく、暗色寄りティール/紫の複合グラデ。
- 内部カードの `border-white/60`（MailAIAssistantPanel.tsx:216,267,281）は、暗色基底に対する極めて低コントラストの境界線。
- `backdrop-filter: blur(18px)` は「ガラス風」の典型。

**3. MASTER_SPEC Mailセクション直接抵触**

MASTER_SPEC.md 89行:
> 「Gmail風だがCoreの密度と白背景に統一」

現行: AIパネルだけが暗色コズミックで、左側の受信トレイ・スレッドビュー（純白 + neutral-200細線 + Notion風）は完全に別トーン。同一アプリ内で「白背景UI」と「未来色AI UI」が視覚的に分断されている。

**4. AI_ASSISTANT_SPEC との不整合（補助）**

AI_ASSISTANT_SPEC.md 7-8行:
> 「Mail は右下FABから開くフローティングAI Assistantを標準とする。」

仕様は配置を定めているが、**背景色・装飾レベルについては一切「未来色」や「コズミック」を許可していない**。AI Assistantの役割は「業務作業を代行するAI秘書」（同2行）であり、UIを「AIっぽく」演出することは役割要件に含まれない。

### 2.2 プロセス違反（AGENTS.md 違反）

- 1_UIリベンジログ_C.md が「意図的に衝突する」「ユーザー明示指示により一時的に棚上げ」と自認。
- 前回 2_Mailフィードバック_B_dash.md（High 1-3）で既に「青グラデ/重影/青アクセント全廃」を最優先推奨していた。
- その指摘を「リベンジ」としてエスカレートさせた。
- 変更後も `docs/AIBOUX_UI_DESIGN_SYSTEM.md`、`docs/AIBOUX_MASTER_SPEC.md`、`docs/AIBOUX_AI_ASSISTANT_SPEC.md` のいずれも更新されていない（AGENTS.md 最終段落違反）。

---

## 3. 文字の視認性・実用性の問題（High / Medium）

### 3.1 High 重要度（長時間業務利用で致命的）

**5. 内部カード境界の低コントラスト（スクリーンショット実測）**

`mail-ui-c-local-ai-panel.png` および `mail-ui-c-local-mobile-ai.png` 確認:
- 内部 Card（「現在のメール」「要約」「音声返信メモ」「AIへの依頼」）の `border-white/60` は、暗色コズミック基底に対して**ほぼ溶け込む**。
- 特にモバイル全画面状態では、白カードの浮遊感が弱く、情報ブロックの区切りが視覚的に曖昧。
- 業務メール処理で「現在のメール」カードと「要約」カードを高速で往復する際に、境界が不明瞭。

**6. ヘッダー文字と基底のコントラストは良好だが、全体トーンが「別アプリ」**

- ヘッダー `text-white` / `text-cyan-50/85` + 暗色グラデは局所的には読める。
- しかし左側の純白Notion風リスト（neutral-950文字 + neutral-200罫線）と**色温度・明度・雰囲気で完全に乖離**。
- ユーザーは「Mail本文を読む（白）」→「AIに相談（暗色コズミック）」のたびに瞳孔・色順応を強制される。長時間業務で眼精疲労リスクが高い（MASTER_SPEC「長時間使って疲れないUIを優先する」に真っ向から反する）。

**7. アニメーションによる注意散漫・疲労**

- `mail-ai-cosmic-shift` 18s infinite が背景位置をゆっくり動かす。
- 業務集中時に視野周辺でグラデが微動するのは、**意図せぬ注意喚起**となり、集中力低下を招く。
- ガラス風 blur + 光点スパークル + glow edge の複合は、典型的な「AI装飾疲労」の原因。

### 3.2 Medium 重要度（操作性・一貫性）

**8. モバイルでの全画面支配**

- モバイルAIパネルはほぼ viewport フル占有（safe-area考慮でも373x832）。
- ユーザーは「メール本文を確認しながらAIに相談」という基本動作が、**実質的に不可能**になる。
- コズミック背景が全画面を覆うため、業務コンテキストの保持が極めて困難。

**9. FABとのトーン不整合**

- FAB（MailClientShell.tsx:291）は依然として `bg-white` + `text-blue-700`（控えめ青）。
- AIパネルを開くと「白い控えめFAB」→「暗色コズミックフルパネル」の急激な変化が発生。発見性と開閉後の視覚的連続性が損なわれている。

**10. 入力欄・フォーカス状態の視認性低下**

- 入力エリアは `bg-white` で回復しているが、周辺の暗色グラデ + cyan系 focus ring が「白い入力欄を浮かせる」効果を弱めている。
- 特にモバイルで周囲が暗いと、入力欄が「孤立した白箱」に見え、コンテキストが掴みにくい。

---

## 4. 肯定的評価（ほぼ皆無）

- 局所的な文字コントラスト（ヘッダー白文字、内部白95%カード）は、**最低限の可読性を意図的に確保しようとした妥協の痕跡**として認める。
- ビルドは成功している。
- ただし「可読性を確保するために白背景を部分的に残さざるを得なかった」という事実自体が、設計の根本的誤りを物語っている。

---

## 5. 残存未完了・TBD（AGENTS.md 準拠）

- **最優先**: `mail-ai-cosmic-panel` 関連全CSS（global.css:106-168）の完全削除 + パネルを純白 + neutral-200細線 + shadow-sm の Notion風へ即時回帰。
- FABも「restrained blue」+ shadow-sm 以内に抑制（B_dash指摘継続）。
- 内部カードの `border-white/60` を `border-neutral-200` へ修正（現在は暗色基底前提の妥協値）。
- `docs/AIBOUX_UI_DESIGN_SYSTEM.md` および MASTER_SPEC / AI_ASSISTANT_SPEC へのUI方針変更反映（今回は「変更」ではなく「違反」なので、むしろ「違反の是正」を明記）。
- 実機長時間（30分以上）業務メール処理での眼精疲労・集中力低下の実測検証（必須）。
- デスクトップでのAI開時ワークスペース扱い（オーバーレイ問題）の根本解決（B_dash以来の継続課題）。

---

## 6. 推奨アクション（優先度順）

1. **即時（24h以内推奨）**: コズミックパネル全廃。`mail-ai-cosmic-panel` クラスと関連keyframes/疑似要素を削除。パネルを `bg-white border border-neutral-200 shadow-sm` の純粋Notion風に戻す。
2. ヘッダーも白背景 + neutral文字 + 控えめ青アクセントに統一（FABと同トーン）。
3. 内部カード境界を `border-neutral-200` に統一し、暗色基底を前提とした `border-white/60` を全廃。
4. アニメーション・blur・glow edge・多色radial/linearのすべてを削除。
5. 今回の変更が「ユーザー明示指示による例外」だった場合でも、**AGENTS.md / MASTER_SPEC が最上位**であることを再確認し、仕様違反を仕様更新で正当化しようとする行為を即中止。
6. 変更実施後、必ず `docs/` 3ファイル（MASTER、UI_DESIGN_SYSTEM、AI_ASSISTANT_SPEC）を更新。
7. 可能なら Playwright で 1440px desktop + 393px mobile のAI開状態を複数アングルで再撮影し、視覚回帰を証跡化。

---

## 7. 検証実行記録

- **必須ドキュメント**: AGENTS.md、MASTER_SPEC、SERVICE_MAP、UI_DESIGN_SYSTEM、AI_ASSISTANT_SPEC を全文読込。
- **コード網羅読込**: MailAIAssistantPanel.tsx（全）、global.css（cosmicセクション全）、MailClientShell.tsx（FAB周辺）、1_UIリベンジログ_C.md（全）、1_MailUI微調整_B.md（全）、2_Mailフィードバック_B_dash.md（全）。
- **Grep検証**: `cosmic` / `mail-ai-cosmic` / `backdrop-filter` が global.css + MailAIAssistantPanel.tsx の2ファイルに限定されていることを確認。
- **スクリーンショット多角解析**（multimodal）:
  - `mail-ui-c-local-ai-panel.png`: 暗色ティール系ヘッダー + 白カードの浮遊感の弱さ + 左側純白リストとの完全な色温度乖離を確認。
  - `mail-ui-c-local-mobile-ai.png`: 全画面支配による業務コンテキスト喪失を確認。
  - `mail-ui-b-*` 比較: B版（薄青グラデ）ですら既に問題視されていたものが、C版でさらに暗色・多層・アニメーション化されたことを視覚的に立証。
- **ビルド**: 1_UIリベンジログ_C.md 記載の `npm run build` 成功を前提に評価（エラー0）。
- **ハルシネーションガード**: すべての主張はファイル:行 + スクリーンショット + 仕様書引用で裏付け。推測は一切なし。

---

## 8. 総評

AIBOUX Mail AIウィンドウ背景を「未来色（コズミック・グラデーション/すりガラス/glow edge）」へ変更した件は、**AGENTS.md / AIBOUX_UI_DESIGN_SYSTEM.md / MASTER_SPEC が定める白基調・Notion風・AI装飾禁止という根本方針に対する、意図的・全面的・アニメーション付きの違反**である。

前回 2_Mailフィードバック_B_dash.md が既に「青グラデ/重影/青アクセント」を High 重要度で問題視し、全廃を最優先推奨していたにもかかわらず、それを「リベンジ」としてさらに過激化した点は、単なるデザイン判断ミスではなく、**プロセスとガバナンスの破綻**を示している。

実用面でも:
- 長時間業務メール処理で「疲れないUI」という最優先事項に反する。
- 内部カードの低コントラスト境界により情報ブロックが視覚的に曖昧。
- モバイル全画面で業務コンテキストが失われる。
- 純白のNotion風ワークスペースとの色温度乖離が、作業時の瞳孔・認知負荷を継続的に強制する。

「文字が読めない等の実用性問題のみ修正対象」と自己申告しているが、**そもそもそのような問題を引き起こす装飾を導入した時点で、AGENTS.md 違反は成立している**。可読性を「後付けで白95%カードで救う」設計自体が、根本方針の誤りを自白しているに等しい。

**この変更は「UI改善」ではなく「UI方針違反のエスカレーション」である。**

即時全廃 + 純白Notion風への完全回帰 + 関連仕様書の是正 + 実機長時間疲労検証を、強く・緊急に推奨する。

---

**出力ファイル**: `/home/pkkatsu/aiboux/all_log/2_UIフィードバック_C_dash.md`（本ファイル）  
**完了報告要件（AGENTS.md + AGENT_RULES.md）**: 本レビュー自体は「変更実施」ではないため24時間限定公開URLの発行対象外。ただし、将来この違反状態を「実装」として扱う場合は、AGENT_RULES.md の Completion Report Rule に従い、必ず `src/lib/server/tempLogShares.ts` 登録 + 再ビルド + 24h限定URL発行 + ユーザー共有を義務とする。  
**次の必須ステップ**: コズミックパネル全廃後に `docs/` 引継書更新の有無を確認し、違反是正の記録を残すこと。

---

*本レビューは静的コード + スクリーンショット多角解析 + 全必須仕様書読込を根拠とし、憶測を排した。AGENTS.md の「不問点はTBD」「決定済み仕様と仮定を混ぜない」を厳守。*
