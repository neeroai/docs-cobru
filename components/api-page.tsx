import { openapi } from '@/lib/openapi';
import { generateCobruCodeSamples } from '@/lib/openapi-code-samples';
import { createAPIPage } from 'fumadocs-openapi/ui';

const RawAPIPage = createAPIPage(openapi, {
  generateCodeSamples() {
    return generateCobruCodeSamples();
  },
});

export const CobruAPIPage = RawAPIPage;

// Wraps RawAPIPage with the default document so MDX can call <APIPage /> without props
export function APIPage() {
  return <RawAPIPage document="./openapi/cobru.yaml" />;
}
