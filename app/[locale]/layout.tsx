import { routing } from '@/i18n/routing';
import { getLocaleUrl, siteConfig } from '@/lib/site';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { DM_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import type { ReactNode } from 'react';

const localeNames = {
  en: { en: 'English', es: 'Spanish' },
  es: { en: 'Inglés', es: 'Español' },
} as const;

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  const description =
    locale === 'es'
      ? 'Documentación oficial bilingüe para integrar la API de pagos de Cobru.'
      : siteConfig.description;

  return {
    title: siteConfig.name,
    description,
    alternates: {
      canonical: getLocaleUrl(locale),
      languages: Object.fromEntries(routing.locales.map((entry) => [entry, getLocaleUrl(entry)])),
    },
    openGraph: {
      title: siteConfig.name,
      description,
      url: getLocaleUrl(locale),
    },
  };
}

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'es')) {
    notFound();
  }

  const currentLocale = locale as keyof typeof localeNames;
  const labels = localeNames[currentLocale] ?? localeNames.en;

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${dmSans.variable} dark`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <RootProvider
            theme={{
              defaultTheme: 'dark',
              enableSystem: false,
            }}
            search={{
              options: {
                type: 'fetch',
                api: '/api/search',
              },
            }}
            i18n={{
              locale,
              locales: [
                { locale: 'en', name: labels.en },
                { locale: 'es', name: labels.es },
              ],
            }}
          >
            {children}
          </RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
