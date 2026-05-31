# m68日本語正本化と公開反映証跡

## 2026-06-01 追加深化: 正本マスターの説明不足修正

- Status: `DEPLOYED`
- 目的: m68を項目列挙ではなく、URL設計、移行判断、データ/ID保護、公開反映証跡、禁止事項、次タスクが読める日本語正本へ深化。
- 更新対象:
  - `AIBOUX_MASTER_DOCUMENT.md`
  - `public/g/m68.md`
  - `ops/instructions/current.md`
  - `all_log/83_master_japanese_rewrite_and_public_reflection.md`
- 追加した主要セクション:
  - `今回の結論`
  - `旧URLから新URLへの移行判定表`
  - `Mail移行の判断根拠`
  - `Shop移行の判断根拠`
  - `独自ドメイン方針`
  - `データ移行方針`
  - `既存ID保護方針`
  - `公開URL検証結果`

### 追加深化後の検証

- `npm run check:control-chars`: `CONTROL_CHAR_CHECK_OK`
- `npm run check:mojibake`: `MOJIBAKE_CHECK_OK`
- `npm run gate:aiboux`: `AIBOUX_GATE_PASS`
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS
- Worker Version ID: `d5e4f2de-0f98-4404-a7a1-05b2a1b00dd1`
- Worker Version number: `211`
- Worker Version created_on: `2026-05-31T21:26:11.093639Z`
- Deployment ID: `ab9dfe13-0fab-4ef4-9055-c6481f49ca9a`
- Deployment created_on: `2026-05-31T21:26:12.66743Z`
- versions evidence: `all_log/83_worker_versions_list_aiboux_after_japanese_m68_deep_deploy.json`
- deployments evidence: `all_log/83_worker_deployments_list_aiboux_after_japanese_m68_deep_deploy.json`

### 追加深化後の公開m68反映証跡

- checked_at: `2026-06-01T06:26:26+09:00`
- curl command: `curl -sS -L -D /tmp/m68-deep.headers https://mail.aiboux.com/g/m68 -o /tmp/m68-deep.body`
- URL: `https://mail.aiboux.com/g/m68`
- HTTP status: `200`
- content-type: `text/markdown; charset=utf-8`
- cache-control: `no-store, max-age=0`
- content-length: `15365`
- public exact sha256: `c190c87b5d4a173af0b0a456f59fc43251a5f711ea7a28e7ccaa9b2ac862ad7f`
- source exact sha256: `2a2e3126bfc6024779d07d40d2cb0157a9d9f3485d831fa277398101307a0d78`
- exact sha256判定: 不一致。理由は公開 `/g/m68` が `__WORKER_VERSION_ID__` と `__WORKER_VERSION_TIMESTAMP__` をCloudflare runtimeの実値へ置換するため。
- public normalized sha256: `e860fe6616b70101ba936e3a481a1b1c1dd45e5f47991e389f74643225e96344`
- source normalized sha256: `e860fe6616b70101ba936e3a481a1b1c1dd45e5f47991e389f74643225e96344`
- normalized sha256判定: 一致。正規化対象は最新Worker Version ID行、Worker Version Timestamp行、deploy後Worker Version ID行、自己参照sha行。

### 追加深化後の公開m68必須語句確認

以下は `/tmp/m68-deep.body` に含まれることを機械確認済み。

- `現在の確定状態`
- `URL Bundle`
- `今回の結論`
- `URL設計の正仕様`
- `旧URLから新URLへの移行判定表`
- `Mail移行の判断根拠`
- `Shop移行の判断根拠`
- `独自ドメイン方針`
- `データ移行方針`
- `既存ID保護方針`
- `Bark通知方針`
- `Gate分離方針`
- `Worker Version ID証跡`
- `Git履歴`
- `公開URL検証結果`
- `公開m68反映証跡`
- `Dirty tree状態`
- `絶対禁止事項`
- `次タスク`

### 追加深化後の8URL公開確認

| URL | HTTP | content-type | cache-control | CSS asset |
|---|---:|---|---|---|
| `https://mail.aiboux.com/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://mail.aiboux.com/s/aiboux/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |

### 追加深化後の禁止事項遵守

- Bark送信: 未実行
- `git reset --hard`: 未実行
- `git clean -fd` / `git clean -fdx`: 未実行
- `rm -rf`: 未実行
- 未追跡ファイル削除: 未実行
- tracked source/config diff revert: 未実行
- force push: 未実行
- secret/PAT/API key表示: 未実行

## 状態

- Status: `DEPLOYED`
- 作業開始時HEAD: `94d05b92b13be63d0334e2909ce00e2a6bd7f6ab`
- 作業開始時origin/main: `94d05b92b13be63d0334e2909ce00e2a6bd7f6ab`
- 正しいremote: `https://github.com/kenchan76/aiboux.git`
- GitHubコネクタ側のNot Foundはrepo不存在ではなく、権限、スコープ、取得経路の問題として扱う。

## 実施範囲

- `AIBOUX_MASTER_DOCUMENT.md` の現在該当セクションを日本語正本化。
- `public/g/m68.md` を日本語のユーザー可読マスターへ全面更新。
- `ops/instructions/current.md` を今回タスクへ更新。
- `https://mail.aiboux.com/g/m68` が日本語本文を返すことをcurlで確認。
- Bark送信、reset、clean、削除、force push、secret表示は未実行。

## 検証コマンド

- `npm run check:control-chars`: `CONTROL_CHAR_CHECK_OK`
- `npm run check:mojibake`: `MOJIBAKE_CHECK_OK`
- `npm run gate:aiboux`: `AIBOUX_GATE_PASS`
- `ESBUILD_WORKER_THREADS=0 npm run build`: PASS
- `npx wrangler deploy`: PASS

## Worker証跡

- Worker name: `aiboux`
- 最新Worker Version ID: `dd94cfa3-b5fa-40a7-8ab1-954b942136f3`
- Worker Version number: `210`
- Worker Version created_on: `2026-05-31T17:28:41.586201Z`
- Deployment ID: `7818a147-41b6-4d52-af06-facf4a551c3a`
- Deployment created_on: `2026-05-31T17:28:43.153788Z`
- versions evidence: `all_log/83_worker_versions_list_aiboux_after_japanese_m68_final_deploy.json`
- deployments evidence: `all_log/83_worker_deployments_list_aiboux_after_japanese_m68_final_deploy.json`
- source commands:
  - `npx wrangler versions list --name aiboux --json`
  - `npx wrangler deployments list --name aiboux --json`

## 公開m68反映証跡

- checked_at: `2026-06-01T02:28:59+09:00`
- curl command: `curl -sS -L -D /tmp/m68-ja-final.headers https://mail.aiboux.com/g/m68 -o /tmp/m68-ja-final.body`
- URL: `https://mail.aiboux.com/g/m68`
- HTTP status: `200`
- content-type: `text/markdown; charset=utf-8`
- cache-control: `no-store, max-age=0`
- content-length: `10085`
- public exact sha256: `4eea929104525f92d8c36a6f86163b9e4fcf020a20448611894cc0a6424fee22`
- source exact sha256: `3cfa5f381af2f049edb3686f23dcfaad0fd28f962fb8bea8fb0e5590a6fa048d`
- exact sha256判定: 不一致。理由は公開 `/g/m68` が `__WORKER_VERSION_ID__` と `__WORKER_VERSION_TIMESTAMP__` をCloudflare runtimeの実値へ置換するため。
- public normalized sha256: `9c230d89b720c5ea64230fcf03796929a8fee11e87fa367dc6c006264c2bd3d9`
- source normalized sha256: `9c230d89b720c5ea64230fcf03796929a8fee11e87fa367dc6c006264c2bd3d9`
- normalized sha256判定: 一致。正規化対象は最新Worker Version ID行、Worker Version Timestamp行、自己参照sha行。

## 公開m68必須語句確認

以下は `/tmp/m68-ja-final.body` に含まれることを機械確認済み。

- `現在の確定状態`
- `URL設計の正仕様`
- `移行判定表`
- `旧URLから新URLへの移行`
- `Mailの移行理由`
- `Shopの移行理由`
- `独自ドメイン方針`
- `Bark通知方針`
- `Gate分離方針`
- `Worker証跡`
- `dirty tree状態`
- `絶対禁止事項`
- `次タスク`
- `公開m68反映証跡`
- `dd94cfa3-b5fa-40a7-8ab1-954b942136f3`

## URL Bundle

- マスター: `https://mail.aiboux.com/g/m68`
- ログ: `https://mail.aiboux.com/g/l68`
- 画面: `https://mail.aiboux.com/g/d68`

## 8URL公開確認

| URL | HTTP | content-type | cache-control | CSS asset |
|---|---:|---|---|---|
| `https://mail.aiboux.com/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://mail.aiboux.com/s/aiboux/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/s/aiboux/` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://shop.aiboux.com/s/aiboux/admin` | 200 | `text/html` | `no-store, max-age=0` | `_astro/global.zVdmg9zH.css` 200 |
| `https://mail.aiboux.com/g/m68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |
| `https://mail.aiboux.com/g/l68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |
| `https://mail.aiboux.com/g/d68` | 200 | `text/markdown; charset=utf-8` | `no-store, max-age=0` | N/A |

## dirty tree状況

- commit前 `git status --short`: 357行
- commit前 `git status --short --untracked-files=all`: 1225行
- commit前 untracked files: 1210件
- commit前 tracked diff files: 15件
- Classification C削除: 未実行、未承認のまま。

## 禁止事項の遵守

- Bark送信: 未実行
- `git reset --hard`: 未実行
- `git clean -fd` / `git clean -fdx`: 未実行
- `rm -rf`: 未実行
- 未追跡ファイル削除: 未実行
- tracked source/config diff revert: 未実行
- force push: 未実行
- secret/PAT/API key表示: 未実行

## 次タスク

- dirty treeのdry-run inventory。
- tracked source/config diffのレビュー。
- untracked filesのカテゴリ集計。
- 削除候補は `USER_ACTION_REQUIRED` としてユーザー承認待ち。
