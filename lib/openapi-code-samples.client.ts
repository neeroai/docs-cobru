"use client";

interface ExampleValue {
  value: string | number | boolean;
}

interface ExampleRequestData {
  method: string;
  header: Record<string, ExampleValue>;
  cookie: Record<string, ExampleValue>;
  body?: unknown;
  bodyMediaType?: string;
}

type CodeUsageGeneratorFn = (url: string, data: ExampleRequestData) => string;

function escapePhpString(value: string) {
  return value.replaceAll('\\', '\\\\').replaceAll("'", "\\'");
}

function toPhpValue(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return `'${escapePhpString(value)}'`;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => toPhpValue(item)).join(', ')}]`;
  }

  return `[
${Object.entries(value as Record<string, unknown>)
  .map(([key, item]) => `    '${escapePhpString(key)}' => ${toPhpValue(item)}`)
  .join(',\n')}
]`;
}

export const jsFetchSample: CodeUsageGeneratorFn = (url, data) => {
  const lines: string[] = [];
  const options: string[] = [`  method: '${data.method.toUpperCase()}'`];
  const headers: Record<string, string> = {};

  if (data.bodyMediaType) headers['Content-Type'] = data.bodyMediaType;

  for (const [key, value] of Object.entries(data.header)) {
    headers[key] = String(value.value);
  }

  const cookies = Object.entries(data.cookie);
  if (cookies.length > 0) {
    headers.cookie = cookies.map(([key, value]) => `${key}=${value.value}`).join('; ');
  }

  if (Object.keys(headers).length > 0) {
    options.push(`  headers: ${JSON.stringify(headers, null, 2).replaceAll('\n', '\n  ')}`);
  }

  if (data.body && data.bodyMediaType === 'application/json') {
    options.push(
      `  body: JSON.stringify(${JSON.stringify(data.body, null, 2).replaceAll('\n', '\n  ')})`
    );
  } else if (data.body && data.bodyMediaType) {
    options.push(`  body: ${JSON.stringify(String(data.body))}`);
  }

  lines.push(`const response = await fetch('${url}', {\n${options.join(',\n')}\n});`);
  lines.push('');
  lines.push('if (!response.ok) {');
  lines.push('  throw new Error(`Cobru request failed: ${response.status}`);');
  lines.push('}');
  lines.push('');
  lines.push('const data = await response.json();');
  lines.push('console.log(data);');

  return lines.join('\n');
};

export const phpSample: CodeUsageGeneratorFn = (url, data) => {
  const headers: string[] = [];

  if (data.bodyMediaType)
    headers.push(`'Content-Type' => '${escapePhpString(data.bodyMediaType)}'`);
  for (const [key, value] of Object.entries(data.header)) {
    headers.push(`'${escapePhpString(key)}' => '${escapePhpString(String(value.value))}'`);
  }

  const body =
    data.body && data.bodyMediaType === 'application/json'
      ? `,\n    'json' => ${toPhpValue(data.body)}`
      : data.body
        ? `,\n    'body' => '${escapePhpString(String(data.body))}'`
        : '';

  return [
    '<?php',
    '',
    'use GuzzleHttp\\Client;',
    'use GuzzleHttp\\Exception\\GuzzleException;',
    '',
    '$client = new Client();',
    '',
    'try {',
    `    $response = $client->request('${data.method.toUpperCase()}', '${url}', [`,
    headers.length > 0
      ? `        'headers' => [\n            ${headers.join(',\n            ')}\n        ]${body}`
      : `        'headers' => []${body}`,
    '    ]);',
    '',
    '    $payload = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);',
    '    var_dump($payload);',
    '} catch (GuzzleException $e) {',
    "    throw new RuntimeException('Cobru request failed: ' . $e->getMessage(), 0, $e);",
    '}',
  ].join('\n');
};
