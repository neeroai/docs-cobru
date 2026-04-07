import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  icon(icon) {
    if (!icon) return;

    if (icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
  i18n: {
    defaultLanguage: 'en',
    languages: ['en', 'es'],
    parser: 'dir', // content lives in en/ and es/ subdirectories
  },
});
