import { source } from "@/lib/source";
import { getLLMText } from "@/lib/llm-text";

export const dynamic = "force-dynamic";

export function GET() {
  const pages = source.getPages("en");
  const lines = pages.map((page) => getLLMText(page));

  return new Response(lines.join("\n\n---\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
