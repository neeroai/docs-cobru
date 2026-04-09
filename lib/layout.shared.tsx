import { CobruDocsLogo } from '@/components/cobru-docs-logo';
import { DocsTopNavLink } from '@/components/docs-top-nav-link';
import { SidebarUtilityBanner, SidebarUtilityFooter } from '@/components/sidebar-utility-links';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';

export function getDocsLayoutOptions(locale: string): Omit<DocsLayoutProps, 'tree' | 'children'> {
  const docsBase = `/${locale}/docs`;

  return {
    nav: {
      title: <CobruDocsLogo />,
      url: docsBase,
      mode: 'top',
      transparentMode: 'none',
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
              `${docsBase}/api/cards`,
              `${docsBase}/api/services`,
              `${docsBase}/api/tokenization`,
              `${docsBase}/api/celo`,
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
              `${docsBase}/build-with-ai`,
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
    ],
    githubUrl: 'https://github.com/neeroai/docs-cobru',
    tabs: false,
    i18n: true,
    searchToggle: {
      full: {
        className:
          'my-auto h-10 max-w-[17rem] rounded-xl border border-fd-border/80 bg-fd-card px-3 text-sm text-fd-muted-foreground shadow-none hover:bg-fd-card hover:text-fd-foreground',
      },
      sm: {
        className: 'rounded-xl border border-transparent bg-transparent text-fd-muted-foreground',
      },
    },
    sidebar: {
      collapsible: false,
      banner: <SidebarUtilityBanner locale={locale} />,
      footer: <SidebarUtilityFooter />,
    },
  };
}
