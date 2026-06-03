# AIBOUX UI Design System

AIBOUX は Light mode only の高密度業務UIを基本とします。サービスごとにUIライブラリを混在させず、ロゴとバッジ表記を統一します。

## Confirmed Decisions

- Light mode only。
- 背景は白中心。
- Notion風の静かなUI。
- 細いborder。
- 情報密度を高くし、一般的SaaSより余白を約20%削減。
- ロゴは小文字 `aiboux` のみ。
- Aマーク、不要ロゴ、謎アイコンは禁止。
- 各サービスに小さいbadgeを付ける。
- Core / Mail / Shop は shadcn/ui。
- File / Biz / Office / 履歴書 は Starwind UI。

## Assumptions

- AIBOUX Public Site は Starwind UI candidate。
- Docs は Vercel Docs / Supabase Docs / Notion風の情報設計を参考にする。
- Mall は購入者向けのため、Core/Shopとは異なる購買UIになる可能性がある。

## TBD

- AIBOUX Public Site の最終UIライブラリ。
- Docs のUIライブラリ。
- Mall のUIライブラリ。
- Bizの最終CTA色。purple案とgreen案の経緯あり。最新版の確定色はTBD。

## Do Not Invent

- ダークモードを入れない。
- AIっぽい紫グラデーション、ガラス風、過剰shadowを使わない。
- 競合UIをそのまま複製しない。
- サービス内で shadcn/ui と Starwind UI を混在させない。
- AIBOUX 履歴書に `RIREKISHO` badge を使わない。

## Mail AI Visual Exception

2026-05-27のユーザー明示指示により、AIBOUX MailのフローティングAI Assistantは例外として未来感のある表現を許可する。

- 許可範囲はAIパネル外装、最下部のAI依頼入力エリア、「よく使う依頼」ボタンに限定する。
- AIBOUXブランドの深いパープルから鮮やかなシアンへ変化する控えめなグラデーション、薄い `backdrop-filter`、1px相当のglow edgeを使用できる。
- 背景アニメーションは極めて遅くし、業務中の注意散漫を避ける。
- 本文カード、要約カード、音声メモ、グラデーション直上のヘッダー/ラベル類は白背景または白に近い背景を維持する。
- 最下部のAI依頼入力エリアは暗めの半透明グラス面 + 白系テキストを使えるが、placeholderやfocus ringを含めて十分なコントラストを確保する。
- 「よく使う依頼」ボタンはピル形状、明確なhover/focus状態、静的ラベルと区別できる背景・影・動きを持たせる。
- テキストは `neutral-950` / `neutral-600` を中心に高コントラストを保つ。
- 重いshadow、高速アニメーション、低コントラスト境界、読みにくい半透明テキストは禁止する。

## Global Tokens

| Token | Value |
|---|---|
| background | `#FFFFFF` |
| subtle background | `#F8FAFC` or `neutral-50` |
| border | `neutral-200` |
| text primary | `neutral-950` / `slate-900` |
| text secondary | `neutral-600` / `slate-600` |
| text muted | `neutral-500` / `slate-500` |
| radius | `rounded-md` / `rounded-lg` |
| shadow | `shadow-sm` only when needed |

## Service Badges

| Service | Badge |
|---|---|
| Core | `CORE` |
| Mail | `MAIL` |
| Shop | `SHOP` |
| Mall | `MALL` |
| File | `FILE` |
| Biz | `BIZ` |
| Office | `OFFICE` |
| Docs | `DOCS` |
| 履歴書 | `履歴書` |

## Service Accent Rules

| Service | Accent |
|---|---|
| Core | neutral / blue |
| Mail | restrained blue |
| Shop | neutral / blue / emerald |
| Mall | `#FF9933`, `#FF4D4D`, `#FFCC00` |
| File | blue |
| Biz | TBD |
| Office | yellow / amber, black text on CTA |
| 履歴書 | soft green |
| Docs | neutral / blue |

## Library Policy

### shadcn/ui

- Core
- Mail
- Shop

### Starwind UI

- File
- Biz
- Office
- 履歴書

### TBD

- Mall
- Docs
- AIBOUX Public Site final decision

## Density Rules

- Section paddingは過剰にしない。
- カードpaddingは `p-4` 程度を基本にする。
- `gap-4` / `gap-5` 中心。
- text-sm を活用する。
- ただし詰め込みすぎて読みにくくしない。

## Office Specific UI

- 左上: `aiboux OFFICE`
- OFFICE badge は黄色系。
- 主要CTAは黄色系背景、文字は黒。
- 保存/ダウンロードボタン付近に広告を置かない。
- Microsoft / Google / Adobe 等と無関係である旨を明記する。

## 履歴書 Specific UI

- 左上: `aiboux 履歴書`
- 英字 `RIREKISHO` badge 禁止。
- CTAは薄めグリーン。
- スマホファースト。
- 個人情報入力画面では広告や余計な誘導を控えめにする。
