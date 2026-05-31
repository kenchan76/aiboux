# Bark URL Bundle Only Notification Evidence

## Status

CODE_READY

## Rule

Bark notification is sent only after URL bundle output.

Forbidden early triggers:

- work start;
- running state;
- watcher start/stop;
- build PASS;
- deploy PASS;
- Playwright PASS;
- review OK/NG;
- automatic fix completion;
- intermediate errors;
- Bark receipt-confirmation waiting.

## Investigation

- `remote-watcher.py`: not present under `/home/pkkatsu`.
- `aiboux-review.py`: not present under `/home/pkkatsu`.
- `scripts/upload-log.sh`: not present under `/home/pkkatsu/aiboux`.
- Existing Bark sender: `scripts/notify-bark.mjs`.
- Existing gate: `scripts/aiboux-gate-check.mjs`.

## Implemented

- `scripts/notify-bark.mjs` now requires master URL, log URL, screen URL, Worker Version ID, and final status before any Bark send.
- Missing URL Bundle returns `skipped=true` with reason `URL_BUNDLE_REQUIRED_BEFORE_BARK`.
- Bark receipt confirmation is no longer a completion gate.
- `scripts/aiboux-gate-check.mjs` separates generic/service-url-routing gates from Core delivery-detail checks.
- `AIBOUX_MASTER_DOCUMENT.md` active policy now states Bark is URL-bundle-only.

## Smoke

Running `node scripts/notify-bark.mjs --stage DEPLOYED --purpose progress --result ok --task "Bark no bundle smoke" --verification "should skip without URL bundle"` returned:

```json
{"provider":"bark","secretLogged":false,"ok":false,"delivered":false,"skipped":true,"userReceiptConfirmed":false,"finalGate":false,"purpose":"progress","reason":"URL_BUNDLE_REQUIRED_BEFORE_BARK","missing":["masterUrl","logUrl","screenUrl","workerVersionId"]}
```

## Gate

- `npm run gate:aiboux`: PASS
- `Bark receipt confirmation is not final gate`: PASS
- `Core delivery-detail /g check not required`: PASS for generic/service URL tasks

## URL Bundle

- Master URL: `https://mail.aiboux.com/g/m68`
- Log URL: `https://mail.aiboux.com/g/l68`
- Screen URL: `https://mail.aiboux.com/g/d68`
- Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`
- Final status: `CODE_READY`

## Bark After URL Bundle

Bark was sent once after the URL Bundle above was written.

```json
{"provider":"bark","secretLogged":false,"ok":true,"delivered":true,"skipped":false,"purpose":"progress","finalGate":false,"endpointHost":"api.day.app","mode":"push-json","status":200,"responseCode":200,"responseMessage":"success","responseType":"json","probeAuth":false,"userReceiptConfirmed":false,"masterUrl":"https://mail.aiboux.com/g/m68","logUrl":"https://mail.aiboux.com/g/l68","screenUrl":"https://mail.aiboux.com/g/d68","workerVersionId":"f8867df3-aab9-439b-bf8d-634ada05191d","finalStatus":"CODE_READY"}
```
