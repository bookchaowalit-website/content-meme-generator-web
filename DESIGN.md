---
name: Press / LOL
description: A small screen-print caption press for composing a two-line meme proof locally.
---

# Design System: Press / LOL

## Overview

**Creative North Star: “The joke is set in ink.”**

Press / LOL is a caption overlay studio, not a media editor or image-generation product. The user writes a top line and a bottom line, chooses an ink color, sees the result on an authored vector proof, and can shuffle to a local preset. The screen-print metaphor gives the tiny tool a memorable own-world.

## Colors

- Midnight ink `#111522` is the press room.
- Coral paper `#f06b55` is the authored proof ground.
- Registration yellow `#f2d34f` marks controls and live selection.
- Signal blue `#6d8cf2` is reserved for secondary annotations.
- White `#f5f0df` is readable copy; avoid gradients so flat ink stays intentional.

## Typography

- Poster captions use a condensed sans stack with heavy weight, uppercase, and a restrained ink outline.
- UI labels use a monospace stack for press marks and control names.
- Supporting copy stays small and direct; it should never compete with the proof.

## Layout

- Controls and the live 16:9 proof share the first viewport on desktop.
- The proof is a single authored vector face with caption layers; controls sit beside it as a press ticket.
- On mobile the ticket comes first, then the proof at a readable width, then the local-only note.

## Elevation & Depth

Flat poster planes and registration rules create depth. The proof has a hard border; no glass panel or shadow stack is needed.

## Shapes

Use square press controls and small 2px corners. The vector’s circular face is content, not a reusable card shape. Avoid pill-heavy controls.

## Components

- **Caption ticket:** top/bottom text fields, color input, and preset action.
- **Live proof:** authored inline SVG with two positioned caption layers.
- **Press mark:** communicates that output is a local visual proof, not a downloadable image pipeline.
- **Preset shuffle:** changes the text locally without pretending to fetch trends.

## Do's and Don'ts

- Do keep the caption result visible while editing.
- Do make the vector artwork authored and deterministic.
- Do state that the tool is client-only and does not export an image file yet.
- Don't imply social trend data, AI generation, or production image export.
- Don't use Impact/Arial Black as a default display voice or turn the proof into a generic card.


---

## Storybook

Storybook 10 (`@storybook/nextjs-vite`) shows this design system with the app's real CSS, tokens and fonts.

```bash
npm run storybook        # http://localhost:6006
npm run build-storybook  # static build in storybook-static/ (CI: .github/workflows/storybook.yml)
```

- **Foundations/Tokens** reads every CSS custom property the app defines at runtime, so it never drifts from the code.
- **Design/DESIGN.md** renders this file.
- **Components/**, **Sections/** and **Pages/** show the UI with mock data only (no network, analytics off).
- Toolbar: locale, theme (light / dark, when the app has a dark theme), viewports 320 / 375 / 768 / 1440. The a11y panel runs axe (WCAG 2.2 AA).
- Rule: a new shared component or page section ships with a story in `stories/`.
