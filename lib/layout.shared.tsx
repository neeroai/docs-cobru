import { CobruDocsLogo } from '@/components/cobru-docs-logo';
import { DocsTopNavLink } from '@/components/docs-top-nav-link';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { ArrowUpRight } from 'lucide-react';

export function getDocsLayoutOptions(locale: string): Omit<DocsLayoutProps, 'tree' | 'children'> {
  const docsBase = `/${locale}/docs`;

  return {
    nav: {
      title: <CobruDocsLogo href={docsBase} />,
      url: docsBase,
      mode: 'top',
    },
    links: [
      {
        type: 'custom',
        on: 'nav',
        children: (
          <DocsTopNavLink
            href={docsBase}
            label="Payments"
            exact={[docsBase]}
            prefixes={[
              `${docsBase}/api/cobrus`,
              `${docsBase}/guides/qr-breb`,
              `${docsBase}/getting-started`,
            ]}
          />
        ),
      },
      {
        type: 'custom',
        on: 'nav',
        children: (
          <DocsTopNavLink
            href={`${docsBase}/payouts`}
            label="Payouts"
            exact={[`${docsBase}/payouts`]}
            prefixes={[
              `${docsBase}/api/envios`,
              `${docsBase}/api/cash-withdrawals`,
              `${docsBase}/api/bank-withdrawals`,
              `${docsBase}/guides/balances`,
              `${docsBase}/guides/movements`,
            ]}
          />
        ),
      },
      {
        type: 'custom',
        on: 'nav',
        children: (
          <DocsTopNavLink
            href={`${docsBase}/platform`}
            label="Platform"
            exact={[`${docsBase}/platform`]}
            prefixes={[
              `${docsBase}/authentication`,
              `${docsBase}/webhooks`,
              `${docsBase}/errors`,
              `${docsBase}/testing`,
              `${docsBase}/production-readiness`,
              `${docsBase}/troubleshooting`,
              `${docsBase}/api/reference`,
            ]}
          />
        ),
      },
      {
        type: 'custom',
        on: 'nav',
        children: (
          <DocsTopNavLink
            href={`${docsBase}/changelog`}
            label="Changelog"
            exact={[`${docsBase}/changelog`]}
          />
        ),
      },
      {
        text: 'GitHub',
        url: 'https://github.com/neeroai/docs-cobru',
        icon: <ArrowUpRight />,
        external: true,
        active: 'none',
        on: 'menu',
      },
    ],
    githubUrl: 'https://github.com/neeroai/docs-cobru',
    tabs: false,
    i18n: true,
  };
}
