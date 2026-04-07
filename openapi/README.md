# OpenAPI Source Of Truth

`openapi/cobru.yaml` is the local copy consumed by Fumadocs and `createOpenAPI()`.

## Expected source

- Stoplight project: `https://cobru.stoplight.io/`
- Format: OpenAPI `3.1` YAML
- Target file: `openapi/cobru.yaml`

## Update workflow

1. Export the latest OpenAPI `3.1` YAML from Stoplight, or sync it with `bun run openapi:sync`.
2. Replace `openapi/cobru.yaml` with the exported file.
3. Run `bun run openapi:validate`.
4. Run `bun run openapi:validate:strict`.
5. Run `bun run build`.

## Automated sync

The public Stoplight workspace exposes docs pages, but the real OpenAPI export still requires authenticated access. The repo includes a fetch script for the internal export endpoint used by Stoplight's frontend bundle.

Required env vars:

- `STOPLIGHT_PROJECT_SLUG`
- `STOPLIGHT_EXPORT_URI`
- `STOPLIGHT_TOKEN`

Optional env vars:

- `STOPLIGHT_WORKSPACE_SLUG` (default: `cobru`)
- `STOPLIGHT_BRANCH_SLUG` (default: `main`)
- `STOPLIGHT_API_BASE` (default: `https://<workspace>.stoplight.io/api`)
- `STOPLIGHT_OUTPUT_PATH` (default: `openapi/cobru.yaml`)

Example:

```bash
STOPLIGHT_PROJECT_SLUG=cobru-docs-en \
STOPLIGHT_EXPORT_URI=<node-export-uri> \
STOPLIGHT_TOKEN=<workspace-export-token> \
bun run openapi:sync
```

If the response is not valid OpenAPI 3 YAML, the script fails without overwriting the local file.

## Public workspace findings

- Public docs projects discovered on `2026-04-07`:
  - `cobru-docs-en` (`project id 216734`, flavor `design`)
  - `cobru-docs` (`project id 215301`, flavor `design`)
- Public docs entry nodes discovered:
  - `0pthfghecr0zd-what-is-cobru`
  - `0pthfghecr0zd-que-es-cobru`
- Direct unauthenticated requests to `/api/v1/projects/<workspace>/<project>` and `/api/v1/projects/<workspace>/<project>/nodes/<public-doc-slug>` returned `404`, so the export URI for the OpenAPI source is not derivable from the public docs pages alone.

## Validation modes

- `bun run openapi:validate`
  Checks basic shape and warns if the spec still contains placeholder markers.
- `bun run openapi:validate:strict`
  Fails if placeholder markers are still present. Use this in CI once the real spec is committed.

## Why strict mode is separate

The repo still contains a temporary placeholder spec during bootstrap. Strict mode exists so the project can switch to hard enforcement without changing the validator itself.
