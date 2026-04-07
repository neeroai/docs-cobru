import { openapi } from '@/lib/openapi';
import { createAPIPage } from 'fumadocs-openapi/ui';

const RawAPIPage = createAPIPage(openapi);

// Wraps RawAPIPage with the default document so MDX can call <APIPage /> without props
export function APIPage() {
  return <RawAPIPage document="./openapi/cobru.yaml" />;
}
