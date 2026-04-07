import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const workspaceSlug = process.env.STOPLIGHT_WORKSPACE_SLUG ?? 'cobru';
const projectSlug = process.env.STOPLIGHT_PROJECT_SLUG;
const branchSlug = process.env.STOPLIGHT_BRANCH_SLUG ?? 'main';
const exportUri = process.env.STOPLIGHT_EXPORT_URI;
const token = process.env.STOPLIGHT_TOKEN;
const outputPath = resolve(
  process.cwd(),
  process.env.STOPLIGHT_OUTPUT_PATH ?? 'openapi/cobru.yaml',
);
const apiBase =
  process.env.STOPLIGHT_API_BASE ??
  `https://${workspaceSlug}.stoplight.io/api`;

const missing = [
  ['STOPLIGHT_PROJECT_SLUG', projectSlug],
  ['STOPLIGHT_EXPORT_URI', exportUri],
  ['STOPLIGHT_TOKEN', token],
].filter(([, value]) => !value);

if (missing.length > 0) {
  console.error('Stoplight sync failed.');
  console.error(
    `Missing required env var(s): ${missing.map(([name]) => name).join(', ')}`,
  );
  process.exit(1);
}

const requestUrl = new URL(
  `${apiBase}/v1/projects/${workspaceSlug}/${projectSlug}/nodes/${exportUri}`,
);
requestUrl.searchParams.set('branch', branchSlug);
requestUrl.searchParams.set('token', token);

const response = await fetch(requestUrl, {
  headers: {
    accept: 'application/yaml, text/yaml, text/plain, application/json',
  },
});

if (!response.ok) {
  console.error('Stoplight sync failed.');
  console.error(`GET ${requestUrl.origin}${requestUrl.pathname}`);
  console.error(`HTTP ${response.status} ${response.statusText}`);
  const body = await response.text();
  if (body) {
    console.error(body.slice(0, 1200));
  }
  process.exit(1);
}

const body = await response.text();

if (!/^openapi:\s*3\./m.test(body)) {
  console.error('Stoplight sync failed.');
  console.error(
    'Response does not look like an OpenAPI 3 YAML document. Check STOPLIGHT_EXPORT_URI and STOPLIGHT_TOKEN.',
  );
  console.error(body.slice(0, 1200));
  process.exit(1);
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, body);

console.log(`OpenAPI spec written to ${outputPath}`);
console.log(`Source: ${requestUrl.origin}${requestUrl.pathname}?branch=${branchSlug}&token=<redacted>`);
