# AIBOUX 履歴書 Spec

AIBOUX 履歴書は、スマホで履歴書・職務経歴書・退職届・送付状・チェックリスト・証明写真作成までできる求職者向けサービスです。

## Confirmed Decisions

- Service name: AIBOUX 履歴書。
- URL: `https://rirekisho.aiboux.com`
- 左上: `aiboux 履歴書`
- 英字 `RIREKISHO` badge は禁止。
- Astro 6 + Starwind UI。
- shadcn/ui禁止。
- Light mode only。
- スマホ対応最優先。
- CTAは薄めグリーン。
- 原則フル機能無料。
- 無料会員登録で保存・再編集・再DL・求人票解析・AI自己PR・写真機能を使える。
- 収益化はメルマガ広告・AIBOUX自社広告・関連広告。

## Assumptions

- 求職者のスマホ利用が主。
- 入力フォームはステップ式。
- 個人情報と顔写真を扱うため、プライバシー設計を最優先にする。

## TBD

- 写真処理の実装方式。
- AI自己PRのモデルと送信範囲。
- 保存期間。
- メルマガ配信基盤。
- 求人票解析の処理基盤。

## Do Not Invent

- `RIREKISHO` 表記を使わない。
- 個人情報を無断で外部送信しない。
- 顔写真を無断保存・無断送信しない。
- メルマガ同意なしに配信しない。
- 削除済み機能を勝手に復活させない。

## Concept

「履歴書も、職務経歴書も、スマホでそのまま作成。」

主な価値:

- スマホで完結。
- 履歴書作成。
- 職務経歴書作成。
- 退職届作成。
- 送付状作成。
- 面接チェックリスト。
- 退職準備チェックリスト。
- 入社準備チェックリスト。
- 生年月日から学歴自動入力。
- 平成 / 令和 / 西暦変換。
- 求人票スクショ解析。
- AI自己PR作成。
- 証明写真作成。
- 顔切り抜き。
- スーツ合成。
- ネットプリント用写真PDF。

## Free Usage Model

ログイン不要:

- サービス説明の閲覧。
- テンプレート一覧の閲覧。
- 履歴書作成の体験。
- 学歴自動計算。
- PDFプレビューの一部。
- サンプルテンプレート閲覧。

無料会員登録:

- 作成データ保存。
- 再編集。
- 再ダウンロード。
- 履歴書保存。
- 職務経歴書保存。
- 退職届保存。
- 送付状保存。
- 求人票スクショ解析。
- AI自己PR作成。
- 証明写真作成。
- 顔切り抜き。
- スーツ合成。
- ネットプリント用写真PDF。
- チェックリスト保存。

## Deleted Features

以下は削除済み。勝手に復活させない。

- 面接ノート。
- 面接想定問答メーカー。
- 応募メール作成。
- 年収/手取り比較。
- 求職活動ログ。

## Pages

- `/`
- `/resume`
- `/resume/new`
- `/career`
- `/career/new`
- `/resignation`
- `/cover-letter`
- `/photo`
- `/photo/print`
- `/job-scan`
- `/self-pr`
- `/checklists/interview`
- `/checklists/resignation`
- `/checklists/onboarding`
- `/templates`
- `/dashboard`
- `/pricing`
- `/help`
- `/terms`
- `/privacy`
- `/commercial`

## Privacy Requirements

- 個人情報を扱う旨を明記。
- プライバシーポリシーへの導線。
- 利用目的の明示。
- 保存・削除の説明。
- private pages は noindex 前提。
- 無料会員登録時の同意導線。
- メルマガ配信停止導線。
