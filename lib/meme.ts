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
