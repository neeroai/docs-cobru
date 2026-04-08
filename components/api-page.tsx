import { openapi } from '@/lib/openapi';
import { createAPIPage } from 'fumadocs-openapi/ui';

const RawAPIPage = createAPIPage(openapi);

export const CobruAPIPage = RawAPIPage;

// Wraps RawAPIPage with the default document so MDX can call <APIPage /> without props
export function APIPage() {
  return <RawAPIPage document="./openapi/cobru.yaml" />;
}
