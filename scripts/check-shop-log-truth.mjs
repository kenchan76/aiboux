#!/usr/bin/env node
import fs from 'node:fs';

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

const l68 = read(files.l68);
const d68 = read(files.d68);
const m68 = read(files.m68);

checkTruthTop('l68', l68, '# AIBOUX Shop Truth Execution Log');
checkTruthTop('d68', d68, '# AIBOUX Shop Screen Evidence Truth Board');

assert(m68.includes('Current Active Operating Override: Truth Log Repair And Process Lock'), 'm68: missing truth log repair override');

for (const [name, text] of Object.entries({ l68, d68 })) {
  assert(!/Status:\s*`?FINAL_ACCEPTED`?/i.test(text), `${name}: must not claim FINAL_ACCEPTED status`);
  assert(!/状態:\s*`?FINAL_ACCEPTED`?/i.test(text), `${name}: must not claim FINAL_ACCEPTED state`);
  assert(!/Status:\s*`?COMPLETED`?/i.test(text), `${name}: must not claim COMPLETED status`);
  assert(!/状態:\s*`?COMPLETED`?/i.test(text), `${name}: must not claim COMPLETED state`);
  assert(!text.includes('## 直近で公開済みの作業'), `${name}: old success-history section remains`);
  assert(!text.includes('## 直近の検証結果'), `${name}: old verification-history section remains`);
  assert(!text.includes('WIP_PASS_NOT_FINAL'), `${name}: old pass-like verdict remains`);
  assert(!text.includes('Trust / proof matrix'), `${name}: visible trust-matrix wording remains`);
  assert(!text.includes('Page guide'), `${name}: visible page-guide wording remains`);
}

assert((l68.match(/定期購入DB:/g) || []).length === 1, 'l68: D1 subscription blocker must be exactly one line marker');
assert((d68.match(/定期購入DB:/g) || []).length === 1, 'd68: D1 subscription blocker must be exactly one line marker');

assert(lineCount(l68) <= 140, `l68: must stay concise, got ${lineCount(l68)} lines`);
assert(lineCount(d68) <= 120, `d68: must stay concise, got ${lineCount(d68)} lines`);

if (failures.length > 0) {
  console.error('SHOP_LOG_TRUTH_NG');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('SHOP_LOG_TRUTH_PASS');
