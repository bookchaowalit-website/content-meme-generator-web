---
name: Meme Generator
description: Two caption lines on an authored picture, made and downloaded in the browser.
---

# Design System: Meme Generator

## Overview

A caption overlay tool, not a media editor or image-generation product. The user writes a top and a bottom
line, picks an ink colour, sees the result on one authored vector picture, can shuffle through three local
presets, and downloads the result as a PNG made on their device. Since 2026-11-19 it uses the shared App shell
(`app/app-shell.css`, `components/app-shell.tsx`, `APP-SHELL.md`).

## Colors

The page uses only the App shell tokens (`--as-*`, light and dark). The picture keeps its own fixed palette:
coral `#e4634c`, yellow `#f0ce4e`, navy `#1b3f79`, cream `#f7f0da`; captions are outlined in `#162337`.

## Typography

Geist via `next/font` (variable on `<html>`) for the page and the captions (weight 900, uppercase), so the
proof and the PNG look the same on every OS. No mono labels; nothing under 12px.

## Layout

Top bar, page head, then the proof (left) and the caption controls (right). On phones the proof comes first
and the fields follow straight under it, so both fit the first screen and the caption stays visible while typing.

## Components

- **Proof:** inline SVG picture with two caption layers; a placeholder when both lines are empty.
- **Controls:** Top line, Bottom line, a 44px colour well with its hex value, Shuffle preset (plain button),
  Download PNG (the one filled button) and a status line.

## Do's and Don'ts

- Do keep the caption result visible while editing.
- Do say that everything happens in the browser: no upload, account or publishing.
- Don't imply trend data, AI generation or a hosted image service.
