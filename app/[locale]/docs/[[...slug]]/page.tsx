import { CobruAPIPage } from '@/components/api-page';
import { DocsPageActions } from '@/components/docs-page-actions';
import { getMDXComponents } from '@/components/mdx';
import { routing } from '@/i18n/routing';
import { getLocaleUrl, getLocalizedAlternates } from '@/lib/site';
import { source } from '@/lib/source';
import type { TOCItemType } from 'fumadocs-core/toc';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string; slug?: string[] }>;
}

interface NarrativePageData {
  body: React.ComponentType<{ components?: ReturnType<typeof getMDXComponents> }>;
  toc?: TOCItemType[];
  full?: boolean;
}

interface OpenAPIPageData {
  getAPIPageProps: () => React.ComponentProps<typeof CobruAPIPage>;
  toc?: TOCItemType[];
  full?: boolean;
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const openApiData = page.data as Partial<OpenAPIPageData>;
  if (typeof openApiData.getAPIPageProps === 'function') {
    return (
      <DocsPage toc={openApiData.toc} full={openApiData.full}>
        <DocsBody>
          <CobruAPIPage {...openApiData.getAPIPageProps()} />
        </DocsBody>
      </DocsPage>
    );
  }

  const narrativeData = page.data as NarrativePageData;
  const MDX = narrativeData.body;
  const isApiReference = slug?.join('/').startsWith('api/reference') ?? false;
  const markdownSlug = slug && slug.length > 0 ? `/${slug.join('/')}` : '';
  const markdownUrl = `/${locale}/docs-mdx${markdownSlug}`;
  const githubUrl = `https://github.com/neeroai/docs-cobru/blob/main/content/docs/${page.path}`;
  const canonicalPageUrl = getLocaleUrl(locale, docPathFromSlug(slug));

  return (
    <DocsPage toc={narrativeData.toc} full={narrativeData.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {!isApiReference ? (
        <DocsPageActions
          githubUrl={githubUrl}
          markdownUrl={markdownUrl}
          pageUrl={canonicalPageUrl}
        />
      ) : null}
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
  return source
    .generateParams('slug', 'locale')
    .filter((p) => !((p.slug as string[])?.join('/') ?? '').startsWith('api/reference'));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = source.getPage(slug, locale);
  if (!page) notFound();

  const docPath = docPathFromSlug(slug);
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

function docPathFromSlug(slug?: string[]) {
  return slug && slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs';
}
