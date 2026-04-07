import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook';
import { BookOpen, Braces, Waypoints } from 'lucide-react';

export function getDocsLayoutOptions(locale: string): Omit<DocsLayoutProps, 'tree' | 'children'> {
  const docsBase = `/${locale}/docs`;

  return {
    nav: {
      title: 'Cobru Docs',
      url: docsBase,
      mode: 'top',
    },
    links: [],
    githubUrl: 'https://github.com/neeroai/docs-cobru',
    tabs: [
      {
        title: 'Docs',
        url: docsBase,
        description:
          locale === 'es'
            ? 'Introducción, setup y conceptos base de Cobru.'
            : 'Introduction, setup, and core Cobru concepts.',
        icon: <BookOpen />,
      },
      {
        title: 'API',
        url: `${docsBase}/api/reference`,
        description:
          locale === 'es'
            ? 'Referencia interactiva, auth y payloads de la API.'
            : 'Interactive reference, auth headers, and payloads.',
        icon: <Braces />,
      },
      {
        title: locale === 'es' ? 'Guías' : 'Guides',
        url: `${docsBase}/guides/qr-breb`,
        description:
          locale === 'es'
            ? 'Playbooks de integración y flujos de pago locales.'
            : 'Integration playbooks and local payment workflows.',
        icon: <Waypoints />,
      },
    ],
    tabMode: 'navbar',
    i18n: true,
  };
}
