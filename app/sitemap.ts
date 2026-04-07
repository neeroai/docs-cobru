import { routing } from '@/i18n/routing';
import { getLocaleUrl } from '@/lib/site';
import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';

function getDocEntries(locale: string): MetadataRoute.Sitemap {
  const pages = source.getPages(locale);

  return pages.map((page) => ({
    url: `${getLocaleUrl(locale)}${page.slugs.length > 0 ? `/${page.slugs.join('/')}` : ''}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: page.slugs.length === 0 ? 1 : 0.7,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) => [
    {
      url: `https://docs.cobru.co/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: getLocaleUrl(locale),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...getDocEntries(locale),
  ]);
}
