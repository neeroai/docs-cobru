import { openapi } from "@/lib/openapi";
import { createAPIPage } from "fumadocs-openapi/ui";

// APIPage renders the interactive OpenAPI reference
// Initialized at module level — requires fumadocs-openapi + shiki
export const APIPage = createAPIPage(openapi);
