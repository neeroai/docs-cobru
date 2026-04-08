import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

const locales = ['en', 'es'] as const;
const llmsIndex = llms(source);

export const revalidate = 3600;

export function GET() {
  const parts = locales.map((locale) => {
    const label = locale === 'es' ? 'Español' : 'English';

    return [`## ${label}`, '', llmsIndex.index(locale)].join('\n');
  });

  const body = ['# Cobru Docs', '', ...parts].join('\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
