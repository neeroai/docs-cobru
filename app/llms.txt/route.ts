import { getLLMText } from '@/lib/llm-text';
import { source } from '@/lib/source';

const locales = ['en', 'es'] as const;

export const revalidate = 3600;

export function GET() {
  const lines = locales.flatMap((locale) =>
    source.getPages(locale).map((page) => getLLMText(page, locale))
  );

  return new Response(lines.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
