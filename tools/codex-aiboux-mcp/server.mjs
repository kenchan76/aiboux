#!/usr/bin/env node

import { readFileSync } from 'node:fs';

const serverInfo = {
  name: 'aiboux-codex',
  version: '0.1.0',
};

const baseUrl = (process.env.AIBOUX_BASE_URL || 'http://127.0.0.1:8787').replace(/\/+$/, '');
const adminToken = readSecret('AIBOUX_ADMIN_API_TOKEN', 'AIBOUX_ADMIN_API_TOKEN_FILE');

const tools = [
  {
    name: 'aiboux_cloudflare_ai_ping',
    description: 'Run a safe Cloudflare Workers AI connection test through the AIBOUX diagnostic endpoint.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Short non-sensitive diagnostic prompt.',
        },
      },
    },
  },
  {
    name: 'aiboux_ai_health',
    description: 'Check whether the AIBOUX Cloudflare Workers AI binding is visible through the configured endpoint.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let newlineIndex = buffer.indexOf('\n');
  while (newlineIndex >= 0) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (line) void handleLine(line);
    newlineIndex = buffer.indexOf('\n');
  }
});

async function handleLine(line) {
  let message;
  try {
    message = JSON.parse(line);
  } catch (error) {
    writeError(null, -32700, `Invalid JSON: ${error.message}`);
    return;
  }

  if (!message || typeof message !== 'object') return;
  if (message.method === 'notifications/initialized') return;

  try {
    if (message.method === 'initialize') {
      writeResult(message.id, {
        protocolVersion: message.params?.protocolVersion || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo,
      });
      return;
    }

    if (message.method === 'tools/list') {
      writeResult(message.id, { tools });
      return;
    }

    if (message.method === 'tools/call') {
      const result = await callTool(message.params?.name, message.params?.arguments || {});
      writeResult(message.id, {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      });
      return;
    }

    if (message.method === 'resources/list') {
      writeResult(message.id, { resources: [] });
      return;
    }

    if (message.method === 'prompts/list') {
      writeResult(message.id, { prompts: [] });
      return;
    }

    writeError(message.id, -32601, `Unsupported method: ${message.method}`);
  } catch (error) {
    writeError(message.id, -32000, error instanceof Error ? error.message : String(error));
  }
}

async function callTool(name, args) {
  if (name === 'aiboux_ai_health') {
    return requestJson('/api/ai/health');
  }

  if (name === 'aiboux_cloudflare_ai_ping') {
    const prompt = typeof args.prompt === 'string' ? args.prompt.slice(0, 300) : '接続テスト';
    return requestJson(`/api/ai/health?run=1&prompt=${encodeURIComponent(prompt)}`);
  }

  throw new Error(`Unknown tool: ${name}`);
}

async function requestJson(path) {
  const headers = { accept: 'application/json' };
  if (adminToken) headers['x-aiboux-admin-token'] = adminToken;

  const response = await fetch(`${baseUrl}${path}`, { headers });
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 2000) };
  }

  return {
    ok: response.ok,
    status: response.status,
    baseUrl,
    body,
  };
}

function writeResult(id, result) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, result })}\n`);
}

function writeError(id, code, message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } })}\n`);
}

function readSecret(envKey, fileEnvKey) {
  const direct = process.env[envKey]?.trim();
  if (direct) return direct;

  const filePath = process.env[fileEnvKey]?.trim();
  if (!filePath) return '';

  try {
    return readFileSync(filePath, 'utf8').trim();
  } catch {
    return '';
  }
}
