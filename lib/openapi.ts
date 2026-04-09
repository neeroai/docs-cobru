import { OPENAPI_DOCUMENT_PATH } from '@/lib/openapi-document';
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: [OPENAPI_DOCUMENT_PATH],
});
