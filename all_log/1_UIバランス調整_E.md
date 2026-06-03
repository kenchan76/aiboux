# 1_UIバランス調整_E

作業日時: 2026-05-27 03:22 JST

## 実装概要

AIBOUX MailのAI Assistant内で、ブランドカラー背景に対して白いブロックが多く見える問題を調整した。一番下の `AIへの依頼` 入力エリアは白ベタ背景を廃止し、パープル〜シアン背景に馴染む半透明グラスパネルへ変更した。あわせて「よく使う依頼」ボタンをピル型のグラスボタンへ変更し、静的な白い箱やラベルと明確に区別できるようにした。

## 実装内容

- 最下部のAI入力コンポーザーを `bg-white/12` + `backdrop-blur-xl` の半透明グラスパネルへ変更。
- 入力エリアのラベル、補助ステータス、textarea文字色を白系へ変更。
- Textareaを `bg-white/14`、`border-white/35`、`placeholder:text-white/55`、`focus-visible:ring-cyan-100/35` に変更。
- 添付アイコンボタンを白文字 + `hover:bg-white/15` に変更。
- 送信ボタンは白背景のピル型にして、グラス背景上で押下対象として明確にした。
- 「よく使う依頼」ボタンを `rounded-full` のピル型に変更。
- クイック依頼ボタンに `bg-white/18`、`backdrop-blur-md`、hover時 `bg-white/30`、shadow増加、軽い浮き上がりを追加。
- クイック依頼ボタンの高さを `h-9`、paddingを `px-3` に増やし、押しやすさを改善。

## 変更ファイル

- `src/components/ai/MailAIAssistantPanel.tsx`

## 自己確認

### Build

```bash
npm run build
```

結果:

- 成功。
- `03:21:23 [build] Complete!`

### Local Playwright

対象:

- `http://127.0.0.1:4321/mail/inbox`
- desktop viewport: `1440x900`
- mobile viewport: `393x852`

確認結果:

- desktop AIパネルはviewport内。
- mobile AIパネルは `393x852` viewport内。
- 入力コンポーザー: `bg-white/12`、文字色white、`backdrop-filter: blur(24px)`。
- Textarea: `bg-white/14`、文字色white、focus時cyan ring。
- クイック依頼ボタン: pill型、glass背景、hover時に背景濃度とshadowが変化。
- 送信ボタン: pill型、白背景、violet text。
- focus補助ステータス `入力中: 下書き作成まで実行` が表示される。

証跡:

- `test-results/mail-ui-e-local-ai-panel.png`
- `test-results/mail-ui-e-local-mobile-ai.png`

## 注意点

- 今回はユーザー明示指示により、入力コンポーザーも白基調固定からグラス調へ変更した。
- Grokレビュー後も、グラスUIによる背景との調和とボタンの判別性強化は維持する。
