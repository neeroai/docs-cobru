import { getDocsLayoutOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsRootLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <DocsLayout tree={source.getPageTree(locale)} {...getDocsLayoutOptions(locale)}>
      {children}
    </DocsLayout>
  );
}
