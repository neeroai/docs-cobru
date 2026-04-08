import { docs } from 'collections/server';
import type { Root } from 'fumadocs-core/page-tree';
import { loader } from 'fumadocs-core/source';
import { openapiPlugin, openapiSource } from 'fumadocs-openapi/server';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { openapi } from './openapi';
import { getOpenApiGroupTitle, getOpenApiOperationTitle } from './openapi-i18n';

const docsSource = docs.toFumadocsSource();
const openapiEnSource = await openapiSource(openapi, {
  baseDir: 'en/api/reference',
  groupBy: 'tag',
  meta: { folderStyle: 'folder' },
});
const openapiEsSource = await openapiSource(openapi, {
  baseDir: 'es/api/reference',
  groupBy: 'tag',
  meta: { folderStyle: 'folder' },
});

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: [...docsSource.files, ...openapiEnSource.files, ...openapiEsSource.files],
  },
  plugins: [openapiPlugin()],
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

function titleizeGroup(group: string) {
  return group
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function getMethodClasses(method: string) {
  switch (method.toUpperCase()) {
    case 'POST':
      return 'text-blue-600 dark:text-blue-400';
    case 'DELETE':
      return 'text-red-600 dark:text-red-400';
    case 'PATCH':
      return 'text-orange-600 dark:text-orange-400';
    case 'PUT':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-green-600 dark:text-green-400';
  }
}

function createMethodNode(
  page: {
    data: { title?: string; _openapi?: { method?: string } };
    url: string;
    path?: string;
  },
  locale: string
) {
  const method = (page.data as { _openapi?: { method?: string } })._openapi?.method;
  const operationId = page.url.split('/').at(-1) ?? 'operation';
  const fallbackTitle = page.data.title ?? operationId;
  const title = getOpenApiOperationTitle(locale, operationId, fallbackTitle);
  const name = method
    ? createElement(
        'span',
        { className: 'flex items-center gap-2' },
        title,
        createElement(
          'span',
          {
            className: `ms-auto text-xs text-nowrap font-mono font-medium ${getMethodClasses(method)}`,
          },
          method.toUpperCase()
        )
      )
    : title;

  return {
    type: 'page' as const,
    name,
    url: page.url,
    $id: `openapi:${page.url}`,
    $ref: { file: page.path ?? page.url },
  };
}

type TreeNode = {
  type?: string;
  name?: unknown;
  children?: TreeNode[];
  $id?: string;
  index?: Record<string, unknown>;
};

export function getDocsPageTree(locale: string): Root {
  const tree = source.getPageTree(locale) as unknown as TreeNode & Root;
  const docsPrefix = `/${locale}/docs/api/reference/`;
  const referencePages = source
    .getPages(locale)
    .filter((page) => page.url.startsWith(docsPrefix))
    .map((page) => {
      const relative = page.url.slice(docsPrefix.length);
      const [group] = relative.split('/');
      return { group, page };
    })
    .filter((entry) => entry.group && entry.group.length > 0);

  const groups = new Map<string, ReturnType<typeof createMethodNode>[]>();
  for (const { group, page } of referencePages) {
    const list = groups.get(group) ?? [];
    list.push(createMethodNode(page, locale));
    groups.set(group, list);
  }

  const apiFolder = tree.children?.find((item) => item.type === 'folder' && item.name === 'API');
  const referenceFolder = apiFolder?.children?.find(
    (item) => item.type === 'folder' && item.$id === `${locale}:(02-api)/api/reference`
  );

  if (!referenceFolder) {
    return tree;
  }

  const groupFolders = Array.from(groups.entries()).map(([group, pages]) => ({
    type: 'folder' as const,
    name: getOpenApiGroupTitle(locale, group) ?? titleizeGroup(group),
    defaultOpen: true,
    children: pages,
    $id: `openapi-group:${locale}:${group}`,
  }));

  const indexPage = referenceFolder.index
    ? {
        ...referenceFolder.index,
        name: locale === 'es' ? 'Referencia API' : 'API Reference',
      }
    : undefined;

  referenceFolder.children = indexPage ? [indexPage, ...groupFolders] : groupFolders;

  return tree;
}
