import { getLLMText } from '@/lib/llm-text';
import { source } from '@/lib/source';

const locales = ['en', 'es'] as const;

export const revalidate = 3600;

export function GET() {
  const sections = locales.flatMap((locale) =>
    source.getPages(locale).map((page) => getLLMText(page, locale))
  );

  const header = [
    '# Cobru API Documentation',
    'Complete bilingual documentation for the Cobru payment API.',
    'Locales: en, es',
  ].join('\n\n');

  return new Response(header + sections.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
