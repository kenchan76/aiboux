# Worker Version ID Evidence After Post-Push Triage

## Captured

- checked_at: 2026-06-01T01:16:07+09:00
- Worker name: `aiboux`
- Bark notification: not sent
- Deploy command: not run
- Destructive operations: not run
- Secret/PAT/API token output: not performed

## Actual Worker Version ID

- Worker Version ID: `f8867df3-aab9-439b-bf8d-634ada05191d`

## Source Commands

Read-only commands were run after sourcing `/home/pkkatsu/.aiboux-secrets/cloudflare.env` without printing secret contents:

```text
npx wrangler versions list --name aiboux --json
npx wrangler deployments list --name aiboux --json
```

## Saved Raw Evidence

- `all_log/79_worker_versions_list_aiboux.json`
- `all_log/79_worker_versions_list_aiboux.stderr.txt`
- `all_log/79_worker_deployments_list_aiboux.json`
- `all_log/79_worker_deployments_list_aiboux.stderr.txt`

## Deployment Evidence Summary

The latest deployment returned by `npx wrangler deployments list --name aiboux --json` was:

```text
deployment_id: ab13f87a-b776-4c94-9c25-6081db15f1af
created_on: 2026-05-31T14:22:16.574248Z
version_id: f8867df3-aab9-439b-bf8d-634ada05191d
percentage: 100
```

The version also appeared in `npx wrangler versions list --name aiboux --json`:

```text
version_id: f8867df3-aab9-439b-bf8d-634ada05191d
created_on: 2026-05-31T14:22:13.091117Z
```

## URL Bundle

- Master: `https://mail.aiboux.com/g/m68`
- Log: `https://mail.aiboux.com/g/l68`
- Screen: `https://mail.aiboux.com/g/d68`

## Conclusion

The actual immutable Worker Version ID evidence is now recorded for the AIBOUX gate:

```text
Worker Version ID: f8867df3-aab9-439b-bf8d-634ada05191d
```

## Gate Result

`npm run gate:aiboux` was rerun after recording the Worker Version ID evidence.

```text
PASS: Worker Version ID actual value - requires actual immutable Worker Version ID
AIBOUX_GATE_PASS
```
