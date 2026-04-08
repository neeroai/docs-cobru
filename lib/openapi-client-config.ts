"use client";

import docsMetadata from '@/openapi/docs-metadata.json';
import { defineClientConfig } from 'fumadocs-openapi/ui/client';
import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import { curl } from 'fumadocs-openapi/requests/generators/curl';
import { javascript } from 'fumadocs-openapi/requests/generators/javascript';
import { python } from 'fumadocs-openapi/requests/generators/python';
import { phpSample } from '@/lib/openapi-code-samples.client';

const codeUsages = createCodeUsageGeneratorRegistry();

codeUsages.add('curl', curl);
codeUsages.add('js', {
  ...javascript,
  lang: 'ts',
  label:
    docsMetadata.codeSamples.languages.find((sample) => sample.id === 'js')?.label ??
    'JavaScript / TypeScript',
});
codeUsages.add('python', python);
codeUsages.add('php', {
  lang: 'php',
  label: docsMetadata.codeSamples.languages.find((sample) => sample.id === 'php')?.label ?? 'PHP',
  generate: phpSample,
});

export const openapiClient = defineClientConfig({
  codeUsages,
});
