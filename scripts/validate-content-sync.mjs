import { readdirSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = process.cwd();
const enRoot = resolve(root, 'content/docs/en');
const esRoot = resolve(root, 'content/docs/es');
const includeNames = new Set(['meta.json']);
const includeExtensions = new Set(['.mdx']);

function walk(dir, rootDir) {
  const files = [];

  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walk(fullPath, rootDir));
      continue;
    }

    const extension = entry.slice(entry.lastIndexOf('.'));
    if (includeNames.has(entry) || includeExtensions.has(extension)) {
      files.push(relative(rootDir, fullPath));
    }
  }

  return files.sort();
}

const enFiles = walk(enRoot, enRoot);
const esFiles = walk(esRoot, esRoot);

const onlyInEn = enFiles.filter((file) => !esFiles.includes(file));
const onlyInEs = esFiles.filter((file) => !enFiles.includes(file));

if (onlyInEn.length > 0 || onlyInEs.length > 0) {
  console.error('Localized content trees are out of sync.');

  if (onlyInEn.length > 0) {
    console.error('- Missing in es:');
    for (const file of onlyInEn) console.error(`  - ${file}`);
  }

  if (onlyInEs.length > 0) {
    console.error('- Missing in en:');
    for (const file of onlyInEs) console.error(`  - ${file}`);
  }

  process.exit(1);
}

console.log(`Content sync validation passed: ${enFiles.length} localized file(s) in each tree.`);
