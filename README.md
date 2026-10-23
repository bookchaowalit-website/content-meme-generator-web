# Meme Generator

A small caption press: type a top and bottom line (or cycle through 3 presets) and pick an ink colour; the text is
overlaid on one built-in illustrated SVG canvas. Captions shrink to fit the canvas width and wrap when they are too
long. Everything happens in the browser.

Live: https://meme-generator.bookchaowalit.com (deployed by Vercel CLI; it can lag `main`, see `PRODUCT.md`).

## What it does not do

- No template library, image upload, font-size control, image export/download, sharing or community features.
  Nothing is saved.

## Run

```bash
npm ci
npm run dev
```

## Checks

```bash
npm test           # Vitest: presets and caption sizing, MCP route, home page render, Sentry scrubbing
npm run lint
npm run typecheck
npm run build
```

CI (`.github/workflows/ci.yml`) runs the shared Node workflow (with a line-coverage gate) and the shared security
scan on every push and PR to `main`.

## Code map

- `lib/meme.ts`: the 3 caption presets, `nextPresetIndex` and `captionSize` (font size in container units so a
  caption fits the canvas). Used by the page and the MCP route.
- `app/api/mcp/route.ts`: stateless JSON-RPC endpoint with `get_presets`.
- `lib/sentry.ts` + `instrumentation*.ts`: error reporting to Sentry, errors only, personal data stripped; off when
  `NEXT_PUBLIC_SENTRY_DSN` is unset.
- `app/more-projects/page.tsx`: shared portfolio link page (copied per repository, not a package).
