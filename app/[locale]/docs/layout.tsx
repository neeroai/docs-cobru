import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DocsRootLayout({ children, params }: Props) {
  const { locale } = await params;

  return (
    <DocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)}>
      {children}
    </DocsLayout>
  );
}
