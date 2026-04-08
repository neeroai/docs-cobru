import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = new Set(process.argv.slice(2));
const requireNonPlaceholder = args.has('--require-non-placeholder');

const specPath = resolve(process.cwd(), 'openapi/cobru.yaml');
const spec = readFileSync(specPath, 'utf8');

const checks = [
  {
    label: 'openapi version',
    ok: /^openapi:\s*3\./m.test(spec),
  },
  {
    label: 'info.title',
    ok: /^\s{2}title:\s*.+$/m.test(spec),
  },
  {
    label: 'info.version',
    ok: /^\s{2}version:\s*.+$/m.test(spec),
  },
  {
    label: 'servers',
    ok: /^servers:\s*$/m.test(spec),
  },
  {
    label: 'paths',
    ok: /^paths:\s*$/m.test(spec),
  },
];

const placeholderDetected =
  spec.includes('**PLACEHOLDER**') ||
  spec.includes('Reemplazar con el spec exportado') ||
  spec.includes('exportado desde https://cobru.stoplight.io/');

const pathMatches = [...spec.matchAll(/^ {2}\/[^:\n]+:\s*$/gm)];
const pathCount = pathMatches.length;

const failedChecks = checks.filter((check) => !check.ok);

if (failedChecks.length > 0) {
  console.error('OpenAPI validation failed.');
  for (const check of failedChecks) {
    console.error(`- Missing or invalid: ${check.label}`);
  }
  process.exit(1);
}

if (pathCount === 0) {
  console.error('OpenAPI validation failed.');
  console.error('- No path entries found under `paths`.');
  process.exit(1);
}

console.log(`OpenAPI validation passed: ${pathCount} path(s) found in openapi/cobru.yaml.`);

if (placeholderDetected) {
  const message =
    'Placeholder marker detected in openapi/cobru.yaml. Replace it with the repo-owned Cobru contract before enabling strict validation.';

  if (requireNonPlaceholder) {
    console.error(message);
    process.exit(1);
  }

  console.warn(message);
}
