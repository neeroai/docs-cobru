import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

const searchApi = createFromSource(source);

export const dynamic = 'force-static';
export const GET = searchApi.staticGET;
