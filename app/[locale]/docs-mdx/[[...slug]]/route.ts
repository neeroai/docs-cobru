import { source } from '@/lib/source';

interface Props {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { locale, slug } = await params;

  if (slug?.join('/').startsWith('api/reference')) {
    return new Response('Not Found', { status: 404 });
  }

  const page = source.getPage(slug, locale);

  if (!page) {
    return new Response('Not Found', { status: 404 });
  }

  if (!('getText' in page.data) || typeof page.data.getText !== 'function') {
    return new Response('Not Found', { status: 404 });
  }

  const markdown = await page.data.getText('processed');

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
