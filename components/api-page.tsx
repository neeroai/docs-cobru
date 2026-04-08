import { openapi } from '@/lib/openapi';
import { openapiClient } from '@/lib/openapi-client-config';
import { createAPIPage } from 'fumadocs-openapi/ui';

const RawAPIPage = createAPIPage(openapi, {
  client: openapiClient,
});

export const CobruAPIPage = RawAPIPage;

// Wraps RawAPIPage with the default document so MDX can call <APIPage /> without props
export function APIPage() {
  return <RawAPIPage document="./openapi/cobru.yaml" />;
}
