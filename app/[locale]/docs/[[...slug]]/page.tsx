import { getMDXComponents } from '@/components/mdx';
import { routing } from '@/i18n/routing';
import { getLocaleUrl, getLocalizedAlternates } from '@/lib/site';
import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string; slug?: string[] }>;
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  // generateParams with i18n returns { slug, locale } for all locales.
  // Exclude api/reference — APIPage (OpenAPI playground) must render dynamically.
  return source
    .generateParams('slug', 'locale')
    .filter((p) => (p.slug as string[])?.join('/') !== 'api/reference');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const docPath = slug && slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs';
  const languages = getLocalizedAlternates(docPath);

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: getLocaleUrl(locale, docPath),
      languages,
    },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      url: getLocaleUrl(locale, docPath),
      locale: locale === routing.defaultLocale ? 'en_US' : 'es_CO',
    },
  };
}
