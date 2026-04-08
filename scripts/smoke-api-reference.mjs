import { spawn } from 'node:child_process';

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';
const DEFAULT_PORT = '3000';
const START_TIMEOUT_MS = 30_000;

const routes = [
  '/en/docs/api/reference',
  '/en/docs/api/reference/authentication/refreshToken',
  '/en/docs/api/reference/cobrus/createCobru',
  '/en/docs/api/reference/cobrus/estimateCobru',
  '/en/docs/api/reference/services/rechargeCellPhone',
  '/en/docs/api/reference/cards/getDebitCard',
  '/es/docs/api/reference',
  '/es/docs/api/reference/authentication/refreshToken',
  '/es/docs/api/reference/cobrus/createCobru',
  '/es/docs/api/reference/cobrus/estimateCobru',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRoute(baseUrl, route) {
  const response = await fetch(new URL(route, baseUrl), {
    headers: {
      accept: 'text/html',
    },
  });

  const body = await response.text();
  const contentType = response.headers.get('content-type') ?? '';

  if (!response.ok) {
    throw new Error(`${route} returned ${response.status}`);
  }

  if (!contentType.includes('text/html')) {
    throw new Error(`${route} returned unexpected content-type: ${contentType}`);
  }

  if (body.includes('This page couldn’t load') || body.includes('This page couldn&apos;t load')) {
    throw new Error(`${route} rendered the Vercel 500 page`);
  }

  return {
    route,
    status: response.status,
  };
}

async function waitForServer(baseUrl) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < START_TIMEOUT_MS) {
    try {
      const response = await fetch(baseUrl, { redirect: 'manual' });

      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Server is still booting.
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for server at ${baseUrl}`);
}

async function runLocalSmoke() {
  const port = process.env.SMOKE_PORT ?? DEFAULT_PORT;
  const baseUrl = process.env.SMOKE_BASE_URL ?? `http://127.0.0.1:${port}`;

  const server = spawn('bun', ['run', 'start'], {
    env: {
      ...process.env,
      PORT: port,
    },
    stdio: 'inherit',
  });

  try {
    await waitForServer(baseUrl);

    for (const route of routes) {
      const result = await fetchRoute(baseUrl, route);
      console.log(`smoke ok ${result.status} ${result.route}`);
    }
  } finally {
    server.kill('SIGTERM');
    await sleep(1000);
    if (!server.killed) {
      server.kill('SIGKILL');
    }
  }
}

async function runRemoteSmoke() {
  const baseUrl = process.env.SMOKE_BASE_URL;

  if (!baseUrl) {
    throw new Error('SMOKE_BASE_URL is required for remote smoke mode');
  }

  for (const route of routes) {
    const result = await fetchRoute(baseUrl, route);
    console.log(`smoke ok ${result.status} ${result.route}`);
  }
}

const remoteMode = process.argv.includes('--remote');

if (remoteMode) {
  await runRemoteSmoke();
} else {
  await runLocalSmoke();
}
