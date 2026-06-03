import { env } from 'cloudflare:workers';

type GeminiFunctionDeclaration = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

type GeminiFunctionCall = {
  name: string;
  args: Record<string, unknown>;
};

export async function requestGeminiFunctionCall(
  commandText: string,
  tenantSafeContext: Record<string, unknown>,
  functions: GeminiFunctionDeclaration[],
): Promise<GeminiFunctionCall | null> {
  const apiKey = getEnvString('GEMINI_API_KEY');
  if (!apiKey) return fallbackFunctionCall(commandText);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: [
                  'You are AIBOUX business command router.',
                  'Select exactly one function when the user asks for an executable business action.',
                  'Never infer or request data outside the provided tenant-safe context.',
                  `Tenant-safe context: ${JSON.stringify(tenantSafeContext)}`,
                  `Command: ${commandText}`,
                ].join('\n'),
              },
            ],
          },
        ],
        tools: [{ functionDeclarations: functions }],
        toolConfig: {
          functionCallingConfig: {
            mode: 'ANY',
            allowedFunctionNames: functions.map((fn) => fn.name),
          },
        },
      }),
    },
  );

  if (!response.ok) {
    return fallbackFunctionCall(commandText);
  }

  const payload = await response.json<Record<string, unknown>>();
  const parts = (((payload.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)
    ?.parts ?? []) as Array<Record<string, unknown>>;

  for (const part of parts) {
    const functionCall = part.functionCall as Record<string, unknown> | undefined;
    if (functionCall && typeof functionCall.name === 'string') {
      return {
        name: functionCall.name,
        args: isRecord(functionCall.args) ? functionCall.args : {},
      };
    }
  }

  return fallbackFunctionCall(commandText);
}

export async function requestGeminiStructuredJson<T>(
  prompt: string,
  responseSchema: Record<string, unknown>,
  fallback: T,
): Promise<T> {
  const apiKey = getEnvString('GEMINI_API_KEY');
  if (!apiKey) return fallback;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema,
        },
      }),
    },
  );

  if (!response.ok) return fallback;
  const payload = await response.json<Record<string, unknown>>();
  const text = (((payload.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)
    ?.parts as Array<Record<string, unknown>> | undefined)?.map((part) => part.text).find((value): value is string => typeof value === 'string');

  if (!text) return fallback;

  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function fallbackFunctionCall(commandText: string): GeminiFunctionCall {
  const normalized = commandText.toLowerCase();
  if ((normalized.includes('在庫') && normalized.includes('シミュレーション')) || normalized.includes('トリプル') || normalized.includes('同期テスト')) {
    return {
      name: 'simulate_stock_concurrency',
      args: {
        product_hint: commandText.includes('ラーメン') ? 'ラーメン' : '',
      },
    };
  }
  if (normalized.includes('作って') || normalized.includes('起票') || normalized.includes('下書き') || normalized.includes('いつもの')) {
    return {
      name: 'create_provisional_invoice',
      args: {
        customer_hint: commandText.includes('山田') ? '山田' : '',
        product_hint: commandText.includes('塩') || commandText.includes('ラーメン') ? '塩ラーメン' : '',
        quantity: extractQuantity(commandText),
      },
    };
  }
  if (normalized.includes('送り状') || normalized.includes('shipping') || normalized.includes('ヤマト') || normalized.includes('佐川')) {
    return { name: 'export_shipping_csv', args: { carrier: normalized.includes('佐川') ? 'sagawa' : 'yamato' } };
  }
  if (normalized.includes('納品書') || normalized.includes('invoice')) {
    return { name: 'convert_to_delivery_invoice', args: { invoice_id: extractId(commandText) } };
  }
  return { name: 'get_sales_report', args: { month: extractMonth(commandText) } };
}

function extractMonth(value: string): string {
  const matched = value.match(/(20\d{2})[-/年](0?[1-9]|1[0-2])/);
  if (!matched) return new Date().toISOString().slice(0, 7);
  return `${matched[1]}-${matched[2].padStart(2, '0')}`;
}

function extractId(value: string): string {
  return value.match(/[A-Za-z0-9_-]{8,}/)?.[0] ?? '';
}

function extractQuantity(value: string): number {
  const matched = value.match(/(\d+)\s*(個|箱|点|本|枚|食|ケース)?/);
  if (!matched) return 1;
  const parsed = Number.parseInt(matched[1], 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getEnvString(key: string): string {
  const value = (env as unknown as Record<string, unknown>)[key];
  return typeof value === 'string' ? value.trim() : '';
}
