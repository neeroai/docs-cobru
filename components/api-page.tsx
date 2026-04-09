import { openapi } from '@/lib/openapi';
import { OPENAPI_DOCUMENT_PATH } from '@/lib/openapi-document';
import { createAPIPage } from 'fumadocs-openapi/ui';

const RawAPIPage = createAPIPage(openapi);

export const CobruAPIPage = RawAPIPage;

// Wraps RawAPIPage with the default document so MDX can call <APIPage /> without props
export function APIPage() {
  return <RawAPIPage document={OPENAPI_DOCUMENT_PATH} />;
}
