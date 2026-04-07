import type { InferPageType } from "fumadocs-core/source";
import type { source } from "./source";

export function getLLMText(page: InferPageType<typeof source>): string {
  const description = page.data.description ?? "";
  return `# ${page.data.title} (${page.url})\n\n${description}`;
}
