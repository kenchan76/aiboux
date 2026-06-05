# AIBOUX Shop WIP Post Deploy Public Verification

Status: WIP_DEPLOYED_NOT_FINAL

This is not FINAL_ACCEPTED.

## Deploy

- Worker Version ID observed from deploy output: `f8b6823c-7b0e-44b3-912a-e3f474541909`
- Deploy command: `npm run deploy:shop:wip`
- Secret handling: Cloudflare credentials were sourced from the local secret file and were not printed.
- Bark: not sent in this work unit.

## Public Verification Timestamp

`20260605T053955Z`

## Public URL Checks

- `https://mail.aiboux.com/g/m68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/l68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://mail.aiboux.com/g/d68`: HTTP 200 / `text/markdown; charset=utf-8`
- `https://shop.aiboux.com/s/aiboux/`: HTTP 200 / `text/html`
- `https://shop.aiboux.com/s/aiboux/checkout`: HTTP 200 / `text/html`

## SHA256

```text
ea9fdf7cec2db731dfcf0758568368679930d2c487fa71d7e0c89cc5314c690c  public/g/m68.md
98212b937fa63de1a464d1225ecce03dcfd40287f7af1d70161a17d23ecfbd21  all_log/public-checks/20260605T053955Z_m68.body
ef33b562e710aa7f9a2fac7bcf4997e908f730fb011b12d97f2ecf1b73a4be36  public/g/l68.md
ef33b562e710aa7f9a2fac7bcf4997e908f730fb011b12d97f2ecf1b73a4be36  all_log/public-checks/20260605T053955Z_l68.body
abd28607c92d22552cbcfc4d4420061defc2fe493c60b82a713fcb92a6769b51  public/g/d68.md
abd28607c92d22552cbcfc4d4420061defc2fe493c60b82a713fcb92a6769b51  all_log/public-checks/20260605T053955Z_d68.body
```

## Verdict

- Public `/g/l68` matched local source.
- Public `/g/d68` matched local source.
- Public `/g/m68` did not match local source. This remains a separate reconciliation item.
- Shop TOP and checkout are publicly reachable after the WIP deploy.

## Prior Public Playwright Evidence For This WIP

- `gate:shop-cart-checkout`: PASS, 3 tests.
- `gate:shop-public-crawl`: PASS, 11 tests.

## Not Final

Unfinished lanes remain:

- `public/g/m68.md` versus public `/g/m68` reconciliation.
- Subscription D1/provider-backed recurring billing.
- Continued sales-quality polish beyond the focused checkout/crawl WIP.
