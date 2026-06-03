# AIBOUX Public Site Spec

`https://aiboux.com` は AIBOUX シリーズ全体の紹介・入口・ポータルサイトです。アプリ本体ではありません。

## Confirmed Decisions

- URL: `https://aiboux.com`
- 役割: AIBOUX全サービスの紹介・入口・シリーズポータル。
- Core / Mail / Shop / Mall / File / Biz / Office / 履歴書 / Docs への導線を持つ。
- AIBOUXの思想、料金、サービス一覧、ユースケース、関連サービスを説明する。

## Assumptions

- 無料系サービスから業務アプリへの導線を強化する。
- サービスカード中心の高密度レイアウトにする。
- Starwind UI candidate。

## TBD

- UIライブラリ最終決定。
- 実ページ構成の最終URL。
- 料金ページの確定内容。
- 問い合わせ導線。

## Do Not Invent

- アプリ本体として扱わない。
- Mail は `https://mail.aiboux.com`、Mall は `https://mall.aiboux.com` へ導線を置く。
- 未確定料金を掲載しない。
- 誤記 `https//aiboux.com` を使わない。

## Purpose

- AIBOUXシリーズの全体像を伝える。
- 各サービスへの入口を作る。
- AIBOUXのブランド・思想・利用シーンを説明する。
- 無料サービスから業務システムへの導線を作る。

## Candidate Pages

- `/`
- `/services`
- `/core`
- `/shop`
- `/file`
- `/biz`
- `/office`
- `/rirekisho`
- `/docs`
- `/pricing`
- `/about`
- `/contact`
- `/terms`
- `/privacy`

## Service Cards

表示対象:

- Core
- Mail
- Shop
- Mall
- File
- Biz
- Office
- 履歴書
- Docs

Mail / Mall は正式URL確定済み。Mail は `https://mail.aiboux.com`、Mall は `https://mall.aiboux.com` とする。

## UI Direction

- Light mode only。
- Notion風。
- 白背景。
- 細いborder。
- 高密度。
- 余白20%削減。
- サービスカード中心。
- 主要CTAは各サービスへ遷移。

## Content Priorities

1. AIBOUXとは何か。
2. Coreを中心に周辺サービスがつながる構造。
3. 無料入口サービスの価値。
4. Core / Shop / Mail の業務価値。
5. 料金と利用開始導線。
6. Docsへのヘルプ導線。
