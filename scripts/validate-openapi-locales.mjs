import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseDocument } from 'yaml';

const specPath = resolve(process.cwd(), 'openapi/cobru.yaml');
const metadataPath = resolve(process.cwd(), 'openapi/docs-metadata.json');

const spec = parseDocument(readFileSync(specPath, 'utf8')).toJS();
const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));

function normalizeTag(tag) {
  return String(tag).trim().toLowerCase().replaceAll(/\s+/g, '-');
}

function collectOperations(record, sourceLabel) {
  const operations = [];

  for (const [pathKey, pathItem] of Object.entries(record ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!operation || typeof operation !== 'object') continue;
      if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(method)) continue;

      operations.push({
        source: sourceLabel,
        path: pathKey,
        method: method.toUpperCase(),
        operationId: operation.operationId,
        tags: Array.isArray(operation.tags) ? operation.tags : [],
        verificationStatus: operation['x-verification-status'],
      });
    }
  }

  return operations;
}

const operations = [
  ...collectOperations(spec.paths, 'paths'),
  ...collectOperations(spec.webhooks, 'webhooks'),
];

const failures = [];
const warnings = [];
const usedOperationIds = new Set();
const usedGroups = new Set();

for (const operation of operations) {
  if (!operation.operationId) {
    failures.push(`${operation.method} ${operation.path} is missing operationId.`);
    continue;
  }

  usedOperationIds.add(operation.operationId);

  const localizedOperation = metadata.operations?.[operation.operationId];
  if (!localizedOperation?.es || !localizedOperation?.en) {
    failures.push(
      `${operation.operationId} is missing localized titles in openapi/docs-metadata.json.`
    );
  }

  if (!operation.tags.length) {
    failures.push(`${operation.operationId} is missing at least one tag.`);
  }

  for (const tag of operation.tags) {
    const slug = normalizeTag(tag);
    usedGroups.add(slug);

    if (!metadata.groups?.[slug]?.es || !metadata.groups?.[slug]?.en) {
      failures.push(
        `${operation.operationId} uses tag "${tag}" (${slug}) without localized group titles.`
      );
    }
  }

  if (!operation.verificationStatus) {
    warnings.push(`${operation.operationId} is missing x-verification-status.`);
  }
}

for (const operationId of Object.keys(metadata.operations ?? {})) {
  if (!usedOperationIds.has(operationId)) {
    warnings.push(
      `openapi/docs-metadata.json contains unused operation metadata entry "${operationId}".`
    );
  }
}

for (const group of Object.keys(metadata.groups ?? {})) {
  if (!usedGroups.has(group)) {
    warnings.push(`openapi/docs-metadata.json contains unused group metadata entry "${group}".`);
  }
}

if (failures.length > 0) {
  console.error('OpenAPI locale validation failed.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `OpenAPI locale validation passed: ${usedOperationIds.size} operation(s), ${usedGroups.size} group(s).`
);

for (const warning of warnings) {
  console.warn(`Warning: ${warning}`);
}
