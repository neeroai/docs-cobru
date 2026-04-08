import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const cwd = process.cwd();
const rootSpec = resolve(cwd, 'openapi/src/openapi.yaml');
const bundledSpec = resolve(cwd, 'openapi/cobru.yaml');
const redoclyBin = resolve(cwd, 'node_modules/.bin/redocly');
const tempDir = mkdtempSync(join(tmpdir(), 'cobru-openapi-'));
const tempBundle = resolve(tempDir, 'cobru.yaml');

try {
  execFileSync(redoclyBin, ['bundle', rootSpec, '--output', tempBundle], {
    cwd,
    stdio: 'inherit',
  });

  const expected = readFileSync(tempBundle, 'utf8');
  const current = readFileSync(bundledSpec, 'utf8');

  if (expected !== current) {
    console.error('OpenAPI bundle is out of sync.');
    console.error('- Source of truth: openapi/src/openapi.yaml');
    console.error('- Generated artifact: openapi/cobru.yaml');
    console.error('- Run `bun run openapi:bundle` and commit the updated bundle.');
    process.exit(1);
  }

  console.log('OpenAPI bundle sync passed.');
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
