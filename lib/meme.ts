// Caption presets and the small rules the meme page and the MCP route share.

export type Preset = { top: string; bottom: string };

export const PRESETS: Preset[] = [
  { top: "WHEN THE BUILD PASSES", bottom: "ON THE FIRST TRY" },
  { top: "ME: I WILL KEEP IT SIMPLE", bottom: "THE SCOPE: ABSOLUTELY NOT" },
  { top: "SHIP THE SMALL THING", bottom: "THEN MAKE IT STRANGE" },
];

export const DEFAULT_INK = "#f7f0da";

/** The preset after `index`, wrapping back to the first. */
export function nextPresetIndex(index: number): number {
  return (index + 1) % PRESETS.length;
}

// Caption sizing, in cqw (percent of the canvas width; .meme-canvas is a size container).
// Captions are uppercase, heavy and slightly letter-spaced: about 0.72em per character on the fallback fonts.
export const CAPTION_WIDTH_CQW = 90;
export const CAPTION_CHAR_EM = 0.72;
export const CAPTION_MAX_CQW = 7;
export const CAPTION_MIN_CQW = 3.2;

/**
 * Font size (cqw) that lets `text` fit on one line inside the caption box, between the min and max sizes.
 * Captions too long even at the minimum wrap onto more lines instead of being clipped.
 */
export function captionSize(text: string): number {
  const length = text.trim().length;
  if (length === 0) return CAPTION_MAX_CQW;
  const fit = CAPTION_WIDTH_CQW / (length * CAPTION_CHAR_EM);
  return Math.round(Math.min(CAPTION_MAX_CQW, Math.max(CAPTION_MIN_CQW, fit)) * 100) / 100;
}
