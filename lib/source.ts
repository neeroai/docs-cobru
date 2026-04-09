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
  icon?: unknown;
  url?: string;
  path?: string;
  defaultOpen?: boolean;
  $ref?: Record<string, unknown>;
};

type SourcePage = {
  url: string;
  path?: string;
  data: {
    title?: string;
  };
};

function cloneTreeNode(node: TreeNode): TreeNode {
  return {
    ...node,
    index: node.index ? { ...node.index } : undefined,
    children: node.children?.map(cloneTreeNode),
  };
}

function getIcon(name: keyof typeof icons) {
  return createElement(icons[name]);
}

function createPageNode(page: SourcePage, name?: string): TreeNode {
  return {
    type: 'page',
    name: name ?? page.data.title ?? page.url.split('/').at(-1) ?? 'Page',
    url: page.url,
    $id: `manual:${page.url}`,
    $ref: { file: page.path ?? page.url },
  };
}

function createExternalPage(name: string, url: string, id: string): TreeNode {
  return {
    type: 'page',
    name,
    url,
    $id: id,
  };
}

function createFolderNode({
  name,
  icon,
  index,
  children = [],
  id,
  defaultOpen = true,
}: {
  name: string;
  icon?: unknown;
  index?: TreeNode;
  children?: TreeNode[];
  id: string;
  defaultOpen?: boolean;
}): TreeNode {
  return {
    type: 'folder',
    name,
    icon,
    index,
    children,
    defaultOpen,
    $id: id,
  };
}

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

  const pages = new Map(source.getPages(locale).map((page) => [page.url, page as SourcePage]));
  const getPage = (url: string, name?: string) => {
    const page = pages.get(url);
    if (!page) throw new Error(`Missing page for ${url}`);
    return createPageNode(page, name);
  };
  const docsBase = `/${locale}/docs`;
  const labels = {
    payments: locale === 'es' ? 'Payments' : 'Payments',
    payouts: locale === 'es' ? 'Payouts' : 'Payouts',
    platform: locale === 'es' ? 'Platform' : 'Platform',
    cardsServices: locale === 'es' ? 'Cards & Services' : 'Cards & Services',
    cobrus: locale === 'es' ? 'Cobrus' : 'Cobrus',
    transfers: locale === 'es' ? 'Envíos' : 'Transfers',
    cashWithdrawals: locale === 'es' ? 'Retiros en efectivo' : 'Cash withdrawals',
    bankWithdrawals: locale === 'es' ? 'Retiros a bancos' : 'Bank withdrawals',
    services: locale === 'es' ? 'Servicios' : 'Services',
    cards: locale === 'es' ? 'Tarjetas' : 'Cards',
    tokenization: locale === 'es' ? 'Tokenización' : 'Tokenization',
    changelog: locale === 'es' ? 'Changelog' : 'Changelog',
    quickstart: locale === 'es' ? 'Inicio rápido' : 'Quickstart',
    brebGuide: locale === 'es' ? 'Flujo de pago Bre-B' : 'Bre-B payment flow',
    authentication: locale === 'es' ? 'Autenticación' : 'Authentication',
    webhooks: 'Webhooks',
    errors: locale === 'es' ? 'Referencia de errores' : 'Error Reference',
    testing: locale === 'es' ? 'Pruebas' : 'Testing',
    productionReadiness: locale === 'es' ? 'Preparación para producción' : 'Production Readiness',
    troubleshooting: locale === 'es' ? 'Resolución de problemas' : 'Troubleshooting',
    balances: 'Balances',
    movements: locale === 'es' ? 'Movimientos' : 'Movements',
    whitelabel: locale === 'es' ? 'Marca blanca' : 'White-label',
  };

  const paymentsFolder = createFolderNode({
    name: labels.payments,
    icon: getIcon('Wallet'),
    id: `capability:${locale}:payments`,
    index: getPage(docsBase),
    children: [
      getPage(`${docsBase}/getting-started`, labels.quickstart),
      createFolderNode({
        name: labels.cobrus,
        icon: getIcon('Wallet'),
        id: `capability:${locale}:payments:cobrus`,
        index: getPage(`${docsBase}/api/cobrus`),
        children: [
          getPage(`${docsBase}/api/cobrus/create`),
          getPage(`${docsBase}/api/cobrus/payment-details`),
          getPage(`${docsBase}/api/cobrus/breb`),
          getPage(`${docsBase}/api/cobrus/pse`),
          getPage(`${docsBase}/api/cobrus/cash-payments`),
          getPage(`${docsBase}/api/cobrus/nequi`),
          getPage(`${docsBase}/api/cobrus/dale`),
          getPage(`${docsBase}/api/cobrus/bancolombia-button`),
          getPage(`${docsBase}/api/cobrus/daviplata`),
          getPage(`${docsBase}/api/cobrus/credit-card`),
          getPage(`${docsBase}/api/cobrus/consult`),
          getPage(`${docsBase}/api/cobrus/pse-banks`),
          getPage(`${docsBase}/api/cobrus/quote`),
          getPage(`${docsBase}/api/cobrus/edit`),
        ],
      }),
      getPage(`${docsBase}/guides/qr-breb`, labels.brebGuide),
    ],
  });

  const payoutsFolder = createFolderNode({
    name: labels.payouts,
    icon: getIcon('ArrowLeftRight'),
    id: `capability:${locale}:payouts`,
    index: getPage(`${docsBase}/payouts`),
    children: [
      createFolderNode({
        name: labels.transfers,
        icon: getIcon('ArrowLeftRight'),
        id: `capability:${locale}:payouts:transfers`,
        index: getPage(`${docsBase}/api/envios`),
        children: [getPage(`${docsBase}/api/envios/send`), getPage(`${docsBase}/api/envios/list`)],
      }),
      createFolderNode({
        name: labels.cashWithdrawals,
        icon: getIcon('Banknote'),
        id: `capability:${locale}:payouts:cash`,
        index: getPage(`${docsBase}/api/cash-withdrawals`),
        children: [
          getPage(`${docsBase}/api/cash-withdrawals/create`),
          getPage(`${docsBase}/api/cash-withdrawals/list`),
          getPage(`${docsBase}/api/cash-withdrawals/cancel`),
          getPage(`${docsBase}/api/cash-withdrawals/details`),
        ],
      }),
      createFolderNode({
        name: labels.bankWithdrawals,
        icon: getIcon('Building2'),
        id: `capability:${locale}:payouts:bank`,
        index: getPage(`${docsBase}/api/bank-withdrawals`),
        children: [
          getPage(`${docsBase}/api/bank-withdrawals/banks-list`),
          getPage(`${docsBase}/api/bank-withdrawals/list`),
          getPage(`${docsBase}/api/bank-withdrawals/create`),
          getPage(`${docsBase}/api/bank-withdrawals/details`),
          getPage(`${docsBase}/api/bank-withdrawals/create-brazil`),
          getPage(`${docsBase}/api/bank-withdrawals/create-mexico`),
          getPage(`${docsBase}/api/bank-withdrawals/create-argentina`),
          getPage(`${docsBase}/api/bank-withdrawals/bre-b`),
        ],
      }),
      getPage(`${docsBase}/guides/balances`, labels.balances),
      getPage(`${docsBase}/guides/movements`, labels.movements),
    ],
  });

  const platformFolder = createFolderNode({
    name: labels.platform,
    icon: getIcon('ShieldCheck'),
    id: `capability:${locale}:platform`,
    index: getPage(`${docsBase}/platform`),
    children: [
      getPage(`${docsBase}/authentication`, labels.authentication),
      getPage(`${docsBase}/webhooks`, labels.webhooks),
      getPage(`${docsBase}/errors`, labels.errors),
      getPage(`${docsBase}/testing`, labels.testing),
      getPage(`${docsBase}/production-readiness`, labels.productionReadiness),
      getPage(`${docsBase}/troubleshooting`, labels.troubleshooting),
      {
        ...cloneTreeNode(referenceFolder),
        name: locale === 'es' ? 'Referencia API' : 'API Reference',
        icon: getIcon('Braces'),
        $id: `capability:${locale}:platform:reference`,
      },
      createExternalPage('GitHub', 'https://github.com/neeroai/docs-cobru', `${locale}:github`),
      getPage(`${docsBase}/changelog`, labels.changelog),
    ],
  });

  const cardsServicesFolder = createFolderNode({
    name: labels.cardsServices,
    icon: getIcon('CreditCard'),
    id: `capability:${locale}:cards-services`,
    defaultOpen: false,
    children: [
      createFolderNode({
        name: labels.cards,
        icon: getIcon('CreditCard'),
        id: `capability:${locale}:cards-services:cards`,
        index: getPage(`${docsBase}/api/cards`),
        children: [
          getPage(`${docsBase}/api/cards/create`),
          getPage(`${docsBase}/api/cards/topup`),
          getPage(`${docsBase}/api/cards/details`),
          getPage(`${docsBase}/api/cards/movements`),
          getPage(`${docsBase}/api/cards/freeze`),
        ],
      }),
      createFolderNode({
        name: labels.services,
        icon: getIcon('Smartphone'),
        id: `capability:${locale}:cards-services:services`,
        index: getPage(`${docsBase}/api/services`),
        children: [
          getPage(`${docsBase}/api/services/cell-recharge`),
          getPage(`${docsBase}/api/services/pins-list`),
          getPage(`${docsBase}/api/services/pins-buy`),
        ],
      }),
      getPage(`${docsBase}/api/tokenization`, labels.tokenization),
      getPage(`${docsBase}/api/celo`, 'Celo'),
      getPage(`${docsBase}/guides/whitelabel`, labels.whitelabel),
    ],
  });

  return {
    ...tree,
    children: [
      paymentsFolder,
      payoutsFolder,
      platformFolder,
      cardsServicesFolder,
    ] as Root['children'],
  };
}
