import { isMarkdownPreferred } from 'fumadocs-core/negotiation';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (
    isMarkdownPreferred(request) &&
    !pathname.includes('/docs-mdx') &&
    !pathname.includes('/api/reference')
  ) {
    const match = pathname.match(/^\/(en|es)\/docs(?:\/(.*))?$/);

    if (match) {
      const [, locale, slug] = match;
      const rewriteUrl = new URL(request.url);
      rewriteUrl.pathname = `/${locale}/docs-mdx${slug ? `/${slug}` : ''}`;

      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
