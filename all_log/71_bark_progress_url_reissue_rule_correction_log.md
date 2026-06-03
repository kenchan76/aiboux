# Bark Progress Notification and URL Reissue Rule Correction

作成日時: 2026-05-31 JST

## Status

CODE_READY

## Correction

Previous response was incorrect.

Bark progress notifications and URL bundle reissues are not final-only.

CODE_READY, PREVIEW_READY, DEPLOYED, BLOCKED, and USER_ACTION_REQUIRED reports must still provide available URLs when requested and send Bark progress notifications when Bark is requested or configured.

Final Acceptance Bark is separate and still requires `userReceiptConfirmed=true`.

## URLs Reissued

- マスター: `https://mainly-fighters-cruise-screens.trycloudflare.com/m70.html`
- ログ: `https://mainly-fighters-cruise-screens.trycloudflare.com/l70.html`
- 画面: `https://mainly-fighters-cruise-screens.trycloudflare.com/d70.html`

## Bark

### Progress Notification

- purpose: progress
- sent: true
- delivered: true
- skipped: false
- secretLogged: false
- userReceiptConfirmed: false
- finalGate: false
- endpointHost: `api.day.app`
- responseCode: 200
- responseMessage: `success`

### Final Acceptance Notification

- required: false
- reason: current status is CODE_READY

## Notes

- This is not DEPLOYED.
- This is not FINAL_ACCEPTED.
- This is not COMPLETED.
