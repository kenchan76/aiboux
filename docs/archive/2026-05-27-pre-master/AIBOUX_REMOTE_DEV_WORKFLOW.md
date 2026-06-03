# AIBOUX Remote Development Workflow Spec
# (Codex / Claude / 開発AI 共有用ワークフロー指示書)

> Archive note: This file is retained for historical traceability only. The active Source of Truth is `/home/pkkatsu/aiboux/AIBOUX_MASTER_DOCUMENT.md`.
> Any old deployment-approval wording in this archived snapshot is superseded by the current Production Deployment Rule: normal code/UI/API production deployment may run after required verification passes; `git push`, destructive operations, secret exposure/transfer, real external sending, pricing/billing changes, marketplace publication, customer/personal-data external transfer, and high-risk legal/pricing/contract/refund decisions still require human approval.

本ドキュメントは、AIBOUX開発における「ローカルPC非依存・VPS完結型」の新しいリモート開発ワークフローを定義する。
リポジトリで作業するCodexおよび各種開発AIは、自身の稼働環境とユーザー（管理者）の操作環境の違いを正確に理解し、本番環境へのデプロイやGit操作を適切にナビゲートすること。

---

## 1. アーキテクチャの変更点（ローカルPCの破棄）
AIBOUXのソースコードは、今後**ユーザーのローカルPCには一切保存しない。**
すべてのソースコード、開発エージェント（Codex等）、およびテスト環境は「XServer VPS（Ubuntu）」上に一元化される。

- **Host (開発拠点):** XServer VPS (`pkkatsu@85.131.253.64`)
- **Client (操作端末):** ユーザーのローカルPC（またはiPhone）
- **接続方式:** VS Code の `Remote - SSH` 拡張機能を使用。

※ 開発AIは「ユーザーがローカルPCでコードを編集し、VPSへアップロード（同期）する」という前提を**完全に破棄**すること。

---

## 2. Codex（開発AI）の稼働環境と役割
Codex自身も、ユーザーのローカルPCではなく **VPS（Ubuntu）の内部** に常駐、またはVS Code Remote Server経由で起動して稼働する。

- **ファイル操作:** Codexが編集・作成するファイルは、すべてVPS上のローカルリポジトリである。
- **ターミナル実行:** Codexが提案する `npm run build` や `npx wrangler deploy` などのコマンドは、すべてVPSのターミナル上で実行されるものとして扱うこと。

---

## 3. 標準開発ワークフロー

ユーザーとCodexの協業は、以下のサイクルで進行する。同期ズレ（先祖返り）を防ぐため、Git操作はすべてVPS上からリモートリポジトリ（GitHub等）へ直接行う。

1. **AIへの指示:**
   ユーザーは VS Code `Remote - SSH` でVPSに接続し、エディタ上からCodexに対して改修指示を出す（例：「このコンポーネントの余白を調整して」）。
2. **VPS内での直接編集:**
   CodexはVPS内のファイルを直接書き換え、必要に応じてLintやBuildチェックをVPSのターミナルで実行する。
3. **人間による確認と承認 (AIBOUX Absolute Rule):**
   ユーザーはVS Code上で変更内容を確認する。
4. **Git Commit & Push (VPS -> GitHub):**
   ユーザーの承認後、Codexは**VPS上のターミナルから**直接 `git commit` および `git push` を行い、GitHub上のコードを最新化する。
5. **本番デプロイ:**
   GitHub Actions、またはVPSからの `wrangler deploy` によりCloudflare本番環境へ反映する。

---

## 4. 開発AIへの厳格な禁止事項
1. **「ローカルPCにPull/Syncしてください」という指示の禁止:**
   ユーザーのPCにはコードが存在しないため、ローカルPCへのファイルのダウンロードやPullを促す発言をしてはならない。
2. **本番環境への無断反映の禁止 (Hallucination Guard):**
   `AIBOUX_MASTER_SPEC.md` の通り、いかなる場合も人間の承認（Human Approval）なしに `wrangler deploy` や `git push` を自動実行してはならない。必ずユーザーに「実行してよいか」の承認プロンプトを提示すること。
