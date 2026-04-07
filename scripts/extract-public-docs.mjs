#!/usr/bin/env bun
/**
 * Extrae documentación pública de cobru.co/desarrolladores
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function extractPublicDocs() {
  console.log('🔍 Extrayendo documentación pública de cobru.co...\n');

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    // Fetch cobru.co/desarrolladores
    console.log('  → Navegando a https://cobru.co/desarrolladores/');
    await page.goto('https://cobru.co/desarrolladores/', { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Extraer contenido visible
    const content = await page.evaluate(() => {
      const main = document.body.innerText;
      return main;
    });

    // Guardar contenido raw
    const outputPath = path.join(PROJECT_ROOT, 'docs/cobru-developers-page.txt');
    fs.writeFileSync(outputPath, content);

    console.log(`  ✅ Contenido guardado: docs/cobru-developers-page.txt`);
    console.log(`  📊 Tamaño: ${(content.length / 1024).toFixed(2)} KB\n`);

    // También extraer en Markdown
    const mdPath = path.join(PROJECT_ROOT, 'docs/cobru-developers-page.md');
    const mdContent = `# Cobru - Página de Desarrolladores

**Fuente:** https://cobru.co/desarrolladores/
**Extraído:** ${new Date().toISOString()}

---

\`\`\`
${content}
\`\`\`
`;

    fs.writeFileSync(mdPath, mdContent);
    console.log(`  ✅ Versión Markdown: docs/cobru-developers-page.md`);
  } finally {
    await browser.close();
  }
}

extractPublicDocs().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
