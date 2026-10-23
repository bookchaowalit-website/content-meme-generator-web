# Meme Generator — Product truth

> Inferred from the code and copy (no user interview). Checked against the portfolio card claims review
> (`portfolio-site-web/docs/audits/CARD-CLAIMS-REVIEW-2026-10.md`, row `meme-generator`, evidence Live→Prototype) on
> 2026-10-23.

## What it is

A client-only demo that overlays a top and bottom caption on one inline SVG illustration.

## Who it is for

A portfolio visitor who wants to play with a small caption-overlay UI.

## What works today

1. Edit the top and bottom captions, or "Shuffle preset" through 3 built-in caption pairs.
2. Pick the caption ink colour with a colour picker.
3. Each caption is sized from its length to fit the canvas width at any screen size; very long captions wrap.
4. `/api/mcp` answers JSON-RPC with `get_presets` (the same 3 presets).
5. Front-end and server errors go to Sentry (errors only, personal data stripped) when `NEXT_PUBLIC_SENTRY_DSN` is set.

## What does not work (and must not be claimed)

- No popular-template library, custom template upload, font-size control, Canvas/image export or community use
  (claims removed from the portfolio card in the 2026-10 review). The "800 × 450" label is the SVG's view box, not
  an export size.
- No storage, account or sync; nothing survives a reload. No product analytics beyond Vercel Analytics.

## Live URL and deploy state

- Live: https://meme-generator.bookchaowalit.com (HTTP 200 on 2026-10-23).
- The Vercel project `bookchaowalit-meme-generator-frontend` is deployed only by CLI (last production 2026-10-23
  12:22 +07, the CVE patch, commit 96efe76) and its Git link names the old repository
  (`bookchaowalit/bookchaowalit-meme-generator-frontend`), so a push to `main` does not deploy. The live site lags
  `main` (no Sentry, old template MCP route, top caption still clipped at wide screens) until the owner reconnects
  Vercel Git to this repository (owner action D9). `NEXT_PUBLIC_SENTRY_DSN` is already set on the Vercel project
  (Sentry project `content-meme-generator-web`, org `personal-yu0`).

## Boundaries

- Browser-only apart from the stateless `/api/mcp` route.
