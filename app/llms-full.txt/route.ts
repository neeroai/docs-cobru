import { source } from "@/lib/source";
import { getLLMText } from "@/lib/llm-text";

export const dynamic = "force-dynamic";

export function GET() {
  const pages = source.getPages("en");
  const sections = pages.map((page) => getLLMText(page));

  const header = `# Cobru API Documentation\n\nComplete documentation for the Cobru payment API.\nGenerated: ${new Date().toISOString()}\n\n`;

  return new Response(header + sections.join("\n\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
