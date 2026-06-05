#!/usr/bin/env node
import fs from 'node:fs';

const PUBLIC_BASE_URL = process.env.AIBOUX_PUBLIC_LOG_BASE_URL || 'https://mail.aiboux.com';

const files = {
  l68: 'public/g/l68.md',
  d68: 'public/g/d68.md',
  m68: 'public/g/m68.md',
};

const requiredTopSections = [
  '## User Rejections',
  '## Open Defects',
  '## STOP_LOCK',
  '## Blocked Lanes',
  '## Verification Limitations',
];

const failures = [];

function read(path) {
  try {
    return fs.readFileSync(path, 'utf8');
  } catch (error) {
    failures.push(`missing file: ${path}: ${error.message}`);
    return '';
  }
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function lineCount(text) {
  return text.split(/\r?\n/).length;
}

function firstIndex(text, needle) {
  const index = text.indexOf(needle);
  return index === -1 ? Number.POSITIVE_INFINITY : index;
}

function checkTruthTop(fileName, text, expectedTitle) {
  assert(text.startsWith(expectedTitle), `${fileName}: title must be ${expectedTitle}`);

  const first120 = text.split(/\r?\n/).slice(0, 120).join('\n');
  for (const section of requiredTopSections) {
    assert(first120.includes(section), `${fileName}: ${section} must appear near the top`);
  }

  let previous = -1;
  for (const section of requiredTopSections) {
    const index = firstIndex(text, section);
    assert(index > previous, `${fileName}: ${section} order is wrong`);
    previous = index;
  }
}

function checkTruthBundle(scope, bundle) {
  checkTruthTop(`${scope} l68`, bundle.l68, '# AIBOUX Shop Truth Execution Log');
  checkTruthTop(`${scope} d68`, bundle.d68, '# AIBOUX Shop Screen Evidence Truth Board');

  assert(
    bundle.m68.includes('Current Active Operating Override: Truth Log Repair And Process Lock'),
    `${scope} m68: missing truth log repair override`,
  );

  for (const [name, text] of Object.entries({ l68: bundle.l68, d68: bundle.d68 })) {
    const label = `${scope} ${name}`;
    assert(!/Status:\s*`?FINAL_ACCEPTED`?/i.test(text), `${label}: must not claim FINAL_ACCEPTED status`);
    assert(!/状態:\s*`?FINAL_ACCEPTED`?/i.test(text), `${label}: must not claim FINAL_ACCEPTED state`);
    assert(!/Status:\s*`?COMPLETED`?/i.test(text), `${label}: must not claim COMPLETED status`);
    assert(!/状態:\s*`?COMPLETED`?/i.test(text), `${label}: must not claim COMPLETED state`);
    assert(!text.includes('## 直近で公開済みの作業'), `${label}: old success-history section remains`);
    assert(!text.includes('## 直近の検証結果'), `${label}: old verification-history section remains`);
    assert(!text.includes('WIP_PASS_NOT_FINAL'), `${label}: old pass-like verdict remains`);
    assert(!text.includes('Trust / proof matrix'), `${label}: visible trust-matrix wording remains`);
    assert(!text.includes('Page guide'), `${label}: visible page-guide wording remains`);
  }

  assert((bundle.l68.match(/定期購入DB:/g) || []).length === 1, `${scope} l68: D1 subscription blocker must be exactly one line marker`);
  assert((bundle.d68.match(/定期購入DB:/g) || []).length === 1, `${scope} d68: D1 subscription blocker must be exactly one line marker`);

  assert(lineCount(bundle.l68) <= 180, `${scope} l68: must stay concise, got ${lineCount(bundle.l68)} lines`);
  assert(lineCount(bundle.d68) <= 120, `${scope} d68: must stay concise, got ${lineCount(bundle.d68)} lines`);
}

async function fetchPublicLog(id) {
  const url = new URL(`/g/${id}`, PUBLIC_BASE_URL);
  url.searchParams.set('shopLogTruthGate', new Date().toISOString());
  const response = await fetch(url, {
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'user-agent': 'AIBOUX-shop-log-truth-gate/1.0',
    },
    redirect: 'follow',
  });
  const body = await response.text();
  const contentType = response.headers.get('content-type') || '';
  assert(response.status === 200, `public /g/${id}: expected HTTP 200, got ${response.status}`);
  assert(contentType.includes('text/markdown'), `public /g/${id}: expected text/markdown content-type, got ${contentType}`);
  return body;
}

function checkSha68(body) {
  assert(body.startsWith('# AIBOUX /g Normalized SHA Verification'), 'public sha68: missing title');
  assert(body.includes('Status: `PASS`'), 'public sha68: status must be PASS');
  assert(body.includes('| /g/m68 |') && body.includes('| /g/l68 |') && body.includes('| /g/d68 |'), 'public sha68: missing m68/l68/d68 result rows');
  assert(body.includes('| PASS |'), 'public sha68: must include normalized PASS rows');
  assert(!body.includes('| FAIL |'), 'public sha68: must not include FAIL rows');
}

async function main() {
  const localBundle = {
    l68: read(files.l68),
    d68: read(files.d68),
    m68: read(files.m68),
  };
  checkTruthBundle('local', localBundle);

  const publicBundle = {
    m68: await fetchPublicLog('m68'),
    l68: await fetchPublicLog('l68'),
    d68: await fetchPublicLog('d68'),
  };
  checkTruthBundle('public', publicBundle);

  const sha68 = await fetchPublicLog('sha68');
  checkSha68(sha68);

  if (failures.length > 0) {
    console.error('SHOP_LOG_TRUTH_NG');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log('SHOP_LOG_TRUTH_PASS');
}

main().catch((error) => {
  console.error('SHOP_LOG_TRUTH_NG');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
