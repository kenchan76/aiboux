# AIBOUX /g Normalized SHA Verification

Status: `PENDING`

このファイルは `/g/m68`、`/g/l68`、`/g/d68` のruntime Worker Version ID置換を正規化したsha256比較結果を記録する公開証跡です。

初回deploy後に `npm run verify:g-normalized-sha` を実行し、次を記録する。

1. local raw sha256
2. public raw sha256
3. Worker Version IDを `__WORKER_VERSION_ID__` に正規化したlocal normalized sha256
4. Worker Version IDを `__WORKER_VERSION_ID__` に正規化したpublic normalized sha256
5. normalized sha256の一致判定

normalized sha256が一致しない場合はFAIL。

`FINAL_ACCEPTED` は主張しない。
