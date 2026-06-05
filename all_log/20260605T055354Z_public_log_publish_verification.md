# Public Log Publish Verification

Status: WIP_DEPLOYED_NOT_FINAL

## Public URL Bundle

- Master: https://mail.aiboux.com/g/m68
- Log: https://mail.aiboux.com/g/l68
- Screen: https://mail.aiboux.com/g/d68

## Latest Deploy

- Purpose: publish `/g/l68`, `/g/d68`, and latest storefront evidence assets after TOP sales link verification.
- Worker Version ID from deploy output: `aa369de4-d00f-4a34-9124-85462152e691`
- WIP checkpoint commit created by deploy script: `79d06a0`
- Evidence/source commit before deploy: `f96bf00`

## Public URL Verification

Timestamp: `20260605T055354Z`

- `https://mail.aiboux.com/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://shop.aiboux.com/s/aiboux/`: HTTP 200 / `text/html`

## SHA256

- `public/g/l68.md`: `733ad7c2715677b0839e5e75871da9f729b536a5c03c71241d53cad9f2ed3326`
- public `/g/l68` body: `733ad7c2715677b0839e5e75871da9f729b536a5c03c71241d53cad9f2ed3326`
- `public/g/d68.md`: `9373724ca47a0f070167033934b920480b1b8de1c8c93c84645dd5255eb39225`
- public `/g/d68` body: `9373724ca47a0f070167033934b920480b1b8de1c8c93c84645dd5255eb39225`
- `public/g/m68.md`: `ea9fdf7cec2db731dfcf0758568368679930d2c487fa71d7e0c89cc5314c690c`
- public `/g/m68` body: `6221aa050fb8bee73808c9754726eca1ed0a840e3ac01f5214f8a70652dc03da`

## Notes

- `/g/l68` and `/g/d68` source equality is confirmed.
- `/g/m68` source equality is not confirmed and remains a separate reconciliation item.
- Because `/g/l68` is a static markdown asset, it records the Worker Version ID from the preceding storefront verification deploy (`0dbb45dc-ffb2-41fd-9b00-996920d0846f`). The deploy that published that log produced `aa369de4-d00f-4a34-9124-85462152e691`.
