# Shop Public Admin Demo Value Recheck Summary

Status: WIP_PUBLIC_ADMIN_DEMO_VALUES_ZERO

Public URL bundle:

- Execution log URL: https://mail.aiboux.com/g/l68
- Screen evidence URL: https://mail.aiboux.com/g/d68
- Master URL: https://mail.aiboux.com/g/m68

Fix deploy Worker Version ID:

- 117ac4a0-68c2-4807-b650-8c793599f73d

Public admin target:

- https://shop.aiboux.com/s/aiboux/admin?codex_nocache=20260604T002350Z

Result:

- curl public HTML: HTTP 200
- Playwright public rendered DOM: HTTP 200
- Title: AIBOUX SHOP Dashboard
- Fixed demo values: absent in public HTML and rendered DOM

Checked values:

- 2024/05
- 山田
- ¥2,340,000
- 245件
- 2.35%
- ¥9,551
- 28.7%
- TSH-001
- BAG-001
- BTL-500
- #10085
- #10084
- #10083
- 佐藤
- 鈴木
- 田中

Changed files:

- src/components/ai/ShopAIAssistantPanel.tsx
- src/components/ai/GlobalAIAssistant.tsx
- ops/instructions/20260604_shop_public_admin_demo_value_recheck.md
- ops/instructions/current.md
- public/g/l68.md
- public/g/d68.md

Safety:

- No DB write.
- No migration apply.
- No Bark.
- No reset.
- No clean.
- No force push.
- No secret output.

This is WIP evidence and not FINAL_ACCEPTED for the whole Shop tenant.
