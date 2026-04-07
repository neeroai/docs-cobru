import { routing } from '@/i18n/routing';

export const siteConfig = {
  name: 'Cobru Docs',
  description: 'Official bilingual documentation for the Cobru payment API.',
  domain: 'docs.cobru.co',
  url: 'https://docs.cobru.co',
} as const;

export function getLocaleUrl(locale: string, path = '/docs'): string {
  return `${siteConfig.url}/${locale}${path}`;
}

export function getLocalizedAlternates(path = '/docs'): Record<string, string> {
  return Object.fromEntries(routing.locales.map((locale) => [locale, getLocaleUrl(locale, path)]));
}
