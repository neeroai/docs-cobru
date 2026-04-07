import type { InferPageType } from 'fumadocs-core/source';
import type { source } from './source';

function getSectionLines(page: InferPageType<typeof source>): string[] {
  const headings =
    page.data.toc
      ?.map((item) => {
        if (typeof item.title !== 'string') {
          return null;
        }

        return item.title.trim();
      })
      .filter((title): title is string => Boolean(title && title.length > 0)) ?? [];

  if (headings.length === 0) {
    return [];
  }

  return ['Sections:', ...headings.map((heading) => `- ${heading}`)];
}

export function getLLMText(page: InferPageType<typeof source>, locale: string): string {
  const description = page.data.description ?? '';
  const sectionLines = getSectionLines(page);

  return [
    `# ${page.data.title}`,
    `Locale: ${locale}`,
    `URL: ${page.url}`,
    description ? `Description: ${description}` : null,
    sectionLines.length > 0 ? sectionLines.join('\n') : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n\n');
}
