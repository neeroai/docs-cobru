import docsMetadata from '@/openapi/docs-metadata.json';

type Locale = 'en' | 'es';

export function getOpenApiGroupTitle(locale: string, group: string): string {
  const safeLocale = locale === 'es' ? 'es' : 'en';
  return (
    docsMetadata.groups[group as keyof typeof docsMetadata.groups]?.[safeLocale as Locale] ?? group
  );
}

export function getOpenApiOperationTitle(
  locale: string,
  operationId: string,
  fallback: string
): string {
  const safeLocale = locale === 'es' ? 'es' : 'en';
  return (
    docsMetadata.operations[operationId as keyof typeof docsMetadata.operations]?.[
      safeLocale as Locale
    ] ?? fallback
  );
}
