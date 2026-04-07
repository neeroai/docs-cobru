#!/usr/bin/env bun
/**
 * Scraper para documentación Cobru en Stoplight
 * Extrae contenido ES + EN via Playwright headless
 * Salida: docs/raw/{locale}/*.md + _toc.json
 */

import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

const PROJECTS = [
  {
    locale: 'es',
    slug: 'cobru-docs',
    url: 'https://cobru.stoplight.io/docs/cobru-docs',
  },
  {
    locale: 'en',
    slug: 'cobru-docs-en',
    url: 'https://cobru.stoplight.io/docs/cobru-docs-en',
  },
];

/**
 * Convierte HTML a Markdown simple (sin deps externas)
 */
function htmlToMarkdown(html) {
  let md = html;

  // Headers
  md = md.replace(/<h1[^>]*>([^<]*)<\/h1>/gi, '# $1');
  md = md.replace(/<h2[^>]*>([^<]*)<\/h2>/gi, '## $1');
  md = md.replace(/<h3[^>]*>([^<]*)<\/h3>/gi, '### $1');
  md = md.replace(/<h4[^>]*>([^<]*)<\/h4>/gi, '#### $1');
  md = md.replace(/<h5[^>]*>([^<]*)<\/h5>/gi, '##### $1');
  md = md.replace(/<h6[^>]*>([^<]*)<\/h6>/gi, '###### $1');

  // Bold
  md = md.replace(/<strong[^>]*>([^<]*)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([^<]*)<\/b>/gi, '**$1**');

  // Italic
  md = md.replace(/<em[^>]*>([^<]*)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([^<]*)<\/i>/gi, '*$1*');

  // Links
  md = md.replace(/<a\s+href=['"]([^'"]+)['"][^>]*>([^<]*)<\/a>/gi, '[$2]($1)');

  // Code
  md = md.replace(/<code[^>]*>([^<]*)<\/code>/gi, '`$1`');

  // Pre (code blocks)
  md = md.replace(/<pre[^>]*><code[^>]*>([^<]*)<\/code><\/pre>/gs, '```\n$1\n```');
  md = md.replace(/<pre[^>]*>([^<]*)<\/pre>/gs, '```\n$1\n```');

  // Paragraphs
  md = md.replace(/<p[^>]*>([^<]*)<\/p>/gi, '$1\n');

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Trim whitespace
  md = md.trim();

  // Clean multiple newlines
  md = md.replace(/\n{3,}/g, '\n\n');

  return md;
}

/**
 * Extrae el slug de una URL Stoplight
 */
function extractSlug(url) {
  const match = url.match(/\/([a-z0-9\-]+)$/);
  return match ? match[1] : 'index';
}

/**
 * Scrappea un proyecto Stoplight
 */
async function scrapeProject(browser, project) {
  console.log(`\n📄 Iniciando scraping de proyecto: ${project.slug} (${project.locale})`);

  const page = await browser.newPage();
  const toc = [];
  const outputDir = path.join(PROJECT_ROOT, 'docs', 'raw', project.locale);

  // Crear directorio
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // Navegar a la URL base
    console.log(`  → Navegando a ${project.url}`);
    await page.goto(project.url, { waitUntil: 'networkidle' });

    // Esperar sidebar
    console.log('  → Esperando sidebar...');
    await page.waitForSelector('[class*="sidebar"], nav', { timeout: 10000 }).catch(() => {
      console.warn('  ⚠️ Sidebar no encontrado, continuando...');
    });

    // Extraer links del sidebar
    const navLinks = await page.evaluate(() => {
      const links = [];
      // Intenta múltiples selectores comunes de Stoplight
      const selector = document.querySelector('[class*="sidebar"]') || document.querySelector('nav');
      if (!selector) return links;

      selector.querySelectorAll('a[href*="/docs/"]').forEach((el) => {
        const href = el.getAttribute('href');
        const title = el.innerText?.trim();
        if (href && title) {
          links.push({ title, href });
        }
      });

      return links;
    });

    console.log(`  → Encontrados ${navLinks.length} links en sidebar`);

    // Scrappear cada link
    for (const link of navLinks) {
      const slug = extractSlug(link.href);
      console.log(`    • ${link.title} (${slug})`);

      try {
        await page.goto(link.href, { waitUntil: 'networkidle' });
        await page.waitForSelector('article, main, [class*="content"]', { timeout: 5000 }).catch(() => {});

        // Extraer contenido
        const { title, content } = await page.evaluate(() => {
          const contentEl = document.querySelector('article') || document.querySelector('main') || document.querySelector('[class*="content"]');
          const titleEl = document.querySelector('h1');

          return {
            title: titleEl?.innerText?.trim() || 'Sin título',
            content: contentEl?.innerHTML || '',
          };
        });

        // Convertir HTML a Markdown
        const markdown = htmlToMarkdown(content);

        // Crear frontmatter
        const frontmatter = `---
title: "${title}"
source: "${link.href}"
extracted_at: "${new Date().toISOString()}"
locale: ${project.locale}
---

`;

        // Guardar archivo
        const filename = `${slug}.md`;
        const filepath = path.join(outputDir, filename);
        fs.writeFileSync(filepath, frontmatter + markdown);

        toc.push({
          title,
          slug,
          url: link.href,
        });
      } catch (err) {
        console.warn(`      ✗ Error extrayendo: ${err.message}`);
      }
    }

    // Guardar TOC
    const tocPath = path.join(outputDir, '_toc.json');
    fs.writeFileSync(tocPath, JSON.stringify(toc, null, 2));

    console.log(`\n✅ Proyecto completado: ${toc.length} páginas extraídas a docs/raw/${project.locale}/`);
  } finally {
    await page.close();
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando scraper Stoplight para Cobru\n');

  const browser = await chromium.launch({ headless: true });

  try {
    for (const project of PROJECTS) {
      await scrapeProject(browser, project);
    }
    console.log('\n🎉 ¡Scraping completado!");');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\n❌ Error fatal:', err);
  process.exit(1);
});
