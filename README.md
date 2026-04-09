# Cobru Docs

Official developer documentation for integrating the Cobru API.

Cobru helps teams in Colombia build payment flows with local methods such as PSE, Nequi, BRE-B, cards, and other operational money-movement surfaces.

## Start here

If you are integrating Cobru for the first time, use this order:

1. [Quickstart](https://docs.cobru.co/en/docs/getting-started)
2. [Authentication](https://docs.cobru.co/en/docs/authentication)
3. [Webhooks](https://docs.cobru.co/en/docs/webhooks)
4. [API Reference](https://docs.cobru.co/en/docs/api/reference)
5. [BRE-B + QR Guide](https://docs.cobru.co/en/docs/guides/qr-breb)

Spanish documentation is also available at:

- `https://docs.cobru.co/es/docs`

## What you can build with Cobru

- Create hosted payment links
- Accept Colombian payment methods
- Process asynchronous payment updates with webhooks
- Build BRE-B and QR payment experiences
- Operate transfers, withdrawals, digital services, and cards where available

## Core integration model

Cobru currently uses:

- `x-api-key`
- `Authorization: Bearer {access}`

Your first integration usually looks like this:

1. Refresh an access token at `POST /token/refresh/`
2. Create a payment at `POST /cobru/`
3. Build the payment URL from the returned `url` slug
4. Receive payment updates on your `callback` URL

## Environments

- Sandbox: `https://dev.cobru.co`
- Production: `https://prod.cobru.co`

## Important integration notes

- `payment_method_enabled` must be sent as a JSON string
- `payer_redirect_url` and `callback` should always be included
- Cobru webhooks are not signed today
- Some operational API families are still being expanded and re-verified in the public docs

## Support

- Docs: `https://docs.cobru.co`
- Technical support: `soporte@cobru.co`
- Sandbox / panel access: `https://panel.cobru.co`

## About this repository

This repository contains the public documentation site for Cobru, built with Next.js and Fumadocs.

If you maintain the docs or API reference in this repo, use:

- `CONTRIBUTING.md`
- `openapi/README.md`
- `tokens/README.md`

If you are looking for internal maintainer guidance, see:

- `CLAUDE.md`
- `AGENTS.md`
