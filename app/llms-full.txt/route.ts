import { siteConfig } from '@/lib/site';
import { source } from '@/lib/source';

const locales = ['en', 'es'] as const;

export const revalidate = 3600;

export async function GET() {
  const pages = locales.flatMap((locale) =>
    source
      .getPages(locale)
      .filter((page) => typeof (page.data as { getText?: unknown }).getText === 'function')
      .map((page) => ({ locale, page }))
  );

  const sections = await Promise.all(
    pages.map(async ({ locale, page }) => {
      const markdown = await (
        page.data as { getText: (format: 'processed') => Promise<string> }
      ).getText('processed');

      return [
        `# ${page.data.title}`,
        `Locale: ${locale}`,
        `URL: ${siteConfig.url}${page.url}`,
        '',
        markdown.trim(),
      ].join('\n');
    })
  );

  const header = [
    '# Cobru API Documentation',
    '',
    'Complete bilingual documentation for the Cobru payment API.',
    'Locales: en, es',
  ].join('\n');

  return new Response([header, ...sections].join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
