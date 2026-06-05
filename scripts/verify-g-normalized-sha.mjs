#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://mail.aiboux.com';
const DEFAULT_OUTPUT_DIR = `all_log/public-checks/${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}_g_normalized_sha`;
const PLACEHOLDER = '__WORKER_VERSION_ID__';
const TARGETS = [
  { id: 'm68', localPath: 'public/g/m68.md', publicPath: '/g/m68' },
  { id: 'l68', localPath: 'public/g/l68.md', publicPath: '/g/l68' },
  { id: 'd68', localPath: 'public/g/d68.md', publicPath: '/g/d68' },
];

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    outputDir: DEFAULT_OUTPUT_DIR,
    markdownOutput: '',
    jsonOutput: '',
    workerVersionId: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--base-url') {
      args.baseUrl = argv[index + 1] ?? args.baseUrl;
      index += 1;
    } else if (arg === '--output-dir') {
      args.outputDir = argv[index + 1] ?? args.outputDir;
      index += 1;
    } else if (arg === '--markdown-output') {
      args.markdownOutput = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--json-output') {
      args.jsonOutput = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--worker-version-id') {
      args.workerVersionId = argv[index + 1] ?? '';
      index += 1;
    }
  }

  return args;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeWorkerVersion(text, workerVersionId) {
  if (!workerVersionId) return text;
  return text.replace(new RegExp(escapeRegex(workerVersionId), 'g'), PLACEHOLDER);
}

function inferWorkerVersionId(publicBodies) {
  const joined = publicBodies.join('\n');
  const direct = joined.match(/Worker Version ID:\s*`?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`?/i);
  if (direct?.[1]) return direct[1];

  const publicEvidence = joined.match(/Public evidence Worker Version ID:\s*`?([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})`?/i);
  if (publicEvidence?.[1]) return publicEvidence[1];

  return '';
}

async function fetchPublic(baseUrl, publicPath, outputDir, id) {
  const url = new URL(publicPath, baseUrl);
  url.searchParams.set('normalizedShaVerify', new Date().toISOString());
  const response = await fetch(url, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'user-agent': 'AIBOUX-normalized-sha-verifier/1.0',
    },
    redirect: 'follow',
  });
  const body = await response.text();
  const headerText = [
    `status: ${response.status}`,
    ...Array.from(response.headers.entries()).map(([key, value]) => `${key}: ${value}`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(outputDir, `${id}.headers.txt`), headerText, 'utf8');
  fs.writeFileSync(path.join(outputDir, `${id}.public.md`), body, 'utf8');
  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body,
  };
}

function renderMarkdown(result) {
  const lines = [
    '# AIBOUX /g Normalized SHA Verification',
    '',
    `Status: \`${result.ok ? 'PASS' : 'FAIL'}\``,
    '',
    `Verification Time: \`${result.checkedAt}\``,
    '',
    `Worker Version ID: \`${result.workerVersionId || 'NOT_FOUND'}\``,
    '',
    '## Rule',
    '',
    'Runtime Worker Version ID置換がある場合、raw sha256不一致だけで合格にしない。',
    `local/public双方で \`${PLACEHOLDER}\` へ正規化したsha256を比較する。`,
    'normalized sha256が一致しない場合はFAIL。',
    '',
    '## Results',
    '',
    '| Target | HTTP | Content-Type | Local Raw SHA256 | Public Raw SHA256 | Local Normalized SHA256 | Public Normalized SHA256 | Normalized Match |',
    '| --- | ---: | --- | --- | --- | --- | --- | --- |',
  ];

  for (const item of result.targets) {
    lines.push(`| /g/${item.id} | ${item.httpStatus} | ${item.contentType} | ${item.localRawSha256} | ${item.publicRawSha256} | ${item.localNormalizedSha256} | ${item.publicNormalizedSha256} | ${item.normalizedMatch ? 'PASS' : 'FAIL'} |`);
  }

  lines.push(
    '',
    '## Verdict',
    '',
    result.ok
      ? 'Normalized sha256一致。runtime Worker Version ID置換を除き、local/public本文は一致している。'
      : 'Normalized sha256不一致。公開ログ不一致としてFAIL。',
    '',
    '## Notes',
    '',
    '- このファイルはsha検証結果の公開証跡であり、ストアフロントUI変更の証跡ではない。',
    '- `FINAL_ACCEPTED` は主張しない。',
    '',
  );

  return `${lines.join('\n').trimEnd()}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(args.outputDir, { recursive: true });

  const fetched = [];
  for (const target of TARGETS) {
    fetched.push(await fetchPublic(args.baseUrl, target.publicPath, args.outputDir, target.id));
  }

  const workerVersionId = args.workerVersionId || inferWorkerVersionId(fetched.map((item) => item.body));
  const targets = TARGETS.map((target, index) => {
    const localRaw = fs.readFileSync(target.localPath, 'utf8');
    const publicRaw = fetched[index].body;
    const localNormalized = normalizeWorkerVersion(localRaw, workerVersionId);
    const publicNormalized = normalizeWorkerVersion(publicRaw, workerVersionId);
    const localRawSha256 = sha256(localRaw);
    const publicRawSha256 = sha256(publicRaw);
    const localNormalizedSha256 = sha256(localNormalized);
    const publicNormalizedSha256 = sha256(publicNormalized);
    return {
      id: target.id,
      localPath: target.localPath,
      publicUrl: new URL(target.publicPath, args.baseUrl).toString(),
      httpStatus: fetched[index].status,
      contentType: fetched[index].contentType,
      localRawSha256,
      publicRawSha256,
      localNormalizedSha256,
      publicNormalizedSha256,
      normalizedMatch: localNormalizedSha256 === publicNormalizedSha256,
    };
  });

  const result = {
    checkedAt: new Date().toISOString(),
    workerVersionId,
    ok: Boolean(workerVersionId) && targets.every((item) => item.httpStatus === 200 && item.contentType.includes('text/markdown') && item.normalizedMatch),
    targets,
  };

  const jsonPath = args.jsonOutput || path.join(args.outputDir, 'g-normalized-sha.json');
  const markdownPath = args.markdownOutput || path.join(args.outputDir, 'g-normalized-sha.md');
  const markdown = renderMarkdown(result);
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  fs.writeFileSync(markdownPath, markdown, 'utf8');
  process.stdout.write(markdown);

  if (!result.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
