# AIBOUX /g Normalized SHA Verification

Status: `PASS`

Verification Time: `2026-06-05T11:57:32.030Z`

Worker Version ID: `05ac621d-976d-4932-af10-315b35df841d`

## Rule

Runtime Worker Version ID置換がある場合、raw sha256不一致だけで合格にしない。
local/public双方で `__WORKER_VERSION_ID__` へ正規化したsha256を比較する。
normalized sha256が一致しない場合はFAIL。

## Results

| Target | Runtime Worker Version ID | HTTP | Content-Type | Local Raw SHA256 | Public Raw SHA256 | Local Normalized SHA256 | Public Normalized SHA256 | Normalized Match |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| /g/m68 | 05ac621d-976d-4932-af10-315b35df841d | 200 | text/markdown; charset=utf-8 | e399bfba520effecae8f310c8d94ac6d34c7cf35a5c9582c7f189de2436abf74 | 19d4baa19d63e595620dee05a2ad52931866b6d54962853c5a2cbf49a66c7019 | e399bfba520effecae8f310c8d94ac6d34c7cf35a5c9582c7f189de2436abf74 | e399bfba520effecae8f310c8d94ac6d34c7cf35a5c9582c7f189de2436abf74 | PASS |
| /g/l68 | 05ac621d-976d-4932-af10-315b35df841d | 200 | text/markdown; charset=utf-8 | 5bcaa244fd9df09a32ac927166b636e93a7f36b0c3a94544c01b31f630269679 | edf0e36d293186298b3416383ad34839231d5e253b471b22bdbd9ff1c48e2469 | 5bcaa244fd9df09a32ac927166b636e93a7f36b0c3a94544c01b31f630269679 | 5bcaa244fd9df09a32ac927166b636e93a7f36b0c3a94544c01b31f630269679 | PASS |
| /g/d68 | none | 200 | text/markdown; charset=utf-8 | 9ea68abe368b47c2e47caf2c99326c544273685122c18b53dd010fc7fb330260 | 9ea68abe368b47c2e47caf2c99326c544273685122c18b53dd010fc7fb330260 | 9ea68abe368b47c2e47caf2c99326c544273685122c18b53dd010fc7fb330260 | 9ea68abe368b47c2e47caf2c99326c544273685122c18b53dd010fc7fb330260 | PASS |

## Verdict

Normalized sha256一致。runtime Worker Version ID置換を除き、local/public本文は一致している。

## Notes

- このファイルはsha検証結果の公開証跡であり、ストアフロントUI変更の証跡ではない。
- `FINAL_ACCEPTED` は主張しない。
