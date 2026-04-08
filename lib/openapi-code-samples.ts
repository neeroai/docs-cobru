import { jsFetchSample, phpSample } from '@/lib/openapi-code-samples.client';
import docsMetadata from '@/openapi/docs-metadata.json';
import type { CreateAPIPageOptions } from 'fumadocs-openapi/ui';

type CodeSample = ReturnType<
  Exclude<CreateAPIPageOptions['generateCodeSamples'], undefined>
>[number];

type GeneratorKey = 'fetch' | 'php-guzzle';

export function generateCobruCodeSamples(): CodeSample[] {
  const generators: Record<GeneratorKey, typeof jsFetchSample> = {
    fetch: jsFetchSample,
    'php-guzzle': phpSample,
  };

  return docsMetadata.codeSamples.languages.map((sample) => {
    if (sample.disabled) {
      return {
        id: sample.id,
        lang: sample.lang,
        source: false,
      };
    }

    const generator = sample.generator ? generators[sample.generator as GeneratorKey] : undefined;

    return {
      id: sample.id,
      lang: sample.lang,
      label: sample.label,
      source: generator ?? false,
    };
  });
}
