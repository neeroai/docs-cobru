import { siteConfig } from '@/lib/site';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

// Root layout — pass-through shell.
// <html> and <body> are owned by app/[locale]/layout.tsx for per-locale lang attr.
// global-error.tsx provides its own html/body as required by Next.js.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
