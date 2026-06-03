# 1_UIリベンジログ_C

作業日時: 2026-05-27 02:39 JST

## 実装概要

AIBOUX MailのAI Assistantパネルについて、前回Grokレビューで抑えた白基調ルールを今回はユーザー明示指示により一時的に棚上げし、AIパネル外装を未来感のあるコズミック表現へ変更した。

## 実装内容

- AI Assistantの外装に `mail-ai-cosmic-panel` を追加。
- 背景を白から、コズミック・ティール、深い青緑、アメジスト・パープルの複合グラデーションへ変更。
- `backdrop-filter: blur(18px) saturate(150%)` により、ごく薄いすりガラス質感を追加。
- `@keyframes mail-ai-cosmic-shift` で背景位置をゆっくり動かし、静かな未来感を出す。
- パネル境界に虹色系の1px glow edgeを疑似要素で追加。
- 重たいshadowは避け、teal/purpleの控えめな発光のみを使用。
- ヘッダーは透明感のある暗色面にし、タイトル・ステータスは白/シアンで視認性を確保。
- 本文カード、要約カード、音声返信メモ、AI入力欄は白背景または白95%背景を維持。
- AI入力欄は白背景のまま、フォーカス時にcosmic blue/cyan系のborder/ringへ変更。
- AI入力欄フォーカス時に補助ステータスを `入力中: 下書き作成まで実行` へ切り替える。

## 変更ファイル

- `src/components/ai/MailAIAssistantPanel.tsx`
- `src/styles/global.css`

## 自己確認

### Build

```bash
npm run build
```

結果:

- 成功。
- `02:39:12 [build] Complete!`

### Local Playwright

対象:

- `http://127.0.0.1:4321/mail/inbox`
- desktop viewport: `1440x900`
- mobile viewport: `393x852`

確認結果:

- AIパネル外装にcosmic gradientが適用される。
- `backdrop-filter: blur(18px) saturate(1.5)` が適用される。
- パネルshadowは控えめなglowのみ。
- 内部カード背景は白95%で、本文視認性を確保。
- AI入力欄背景は白、focus時borderはcyan系、ringもcyan系。
- focus時に `入力中: 下書き作成まで実行` が表示される。
- デスクトップパネル位置: `x=1000`, `y=160`, `width=420`, `height=720`, viewport内。
- モバイルパネル位置: `x=10`, `y=10`, `width=373`, `height=832`, viewport内。

証跡:

- `test-results/mail-ui-c-local-ai-panel.png`
- `test-results/mail-ui-c-local-mobile-ai.png`

## 注意点

- 今回のデザイン方向は、既存の `AGENTS.md` / `docs/AIBOUX_UI_DESIGN_SYSTEM.md` の「白基調」「紫グラデーション禁止」「ガラス風禁止」と意図的に衝突する。これはユーザーの明示指示に基づく例外扱い。
- Grokレビュー後は、文字が読めない、入力欄が分かりづらい、画面外にはみ出す等の実用性問題のみ修正対象とする。
