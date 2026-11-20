// Turning the live proof into a PNG in the browser: the artwork SVG is drawn on a canvas, then the two
// captions are drawn on top with the same size rules as the page (captionSize, in % of the width).
import { CAPTION_MAX_LENGTH, captionSize } from "@/lib/meme";

export const EXPORT_WIDTH = 1600;
export const EXPORT_HEIGHT = 900;
/** The caption outline colour (the page's text-shadow colour). */
export const OUTLINE = "#162337";

/** User-perceived characters, so a break never splits an emoji or a Thai vowel from its consonant. */
function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((part) => part.segment);
  }
  return Array.from(text);
}

/**
 * Words of `text` packed into lines no wider than `maxWidth`. Like the proof's `overflow-wrap: anywhere`, a word
 * wider than a line (60 W's, Chinese without spaces) is broken between characters instead of running off the PNG.
 */
export function wrapCaption(text: string, maxWidth: number, measure: (line: string) => number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.trim().split(/\s+/).filter(Boolean)) {
    const candidate = line ? `${line} ${word}` : word;
    if (measure(candidate) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const char of graphemes(word)) {
      if (line && measure(line + char) > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line += char;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** The smallest slice of a 2D context drawMeme needs, so tests can pass a recorder. */
export type CaptionContext = Pick<CanvasRenderingContext2D, "fillText" | "strokeText" | "measureText"> & {
  font: string;
  fillStyle: CanvasRenderingContext2D["fillStyle"];
  strokeStyle: CanvasRenderingContext2D["strokeStyle"];
  lineWidth: number;
  lineJoin: CanvasLineJoin;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
};

/** Draws both captions (uppercase, outlined, centred, 5% from the top and bottom edges). */
export function drawCaptions(ctx: CaptionContext, captions: { top: string; bottom: string; ink: string; family: string }, width = EXPORT_WIDTH, height = EXPORT_HEIGHT) {
  const boxWidth = width * 0.9;
  for (const [full, edge] of [[captions.top, "top"], [captions.bottom, "bottom"]] as const) {
    // Same cap as the inputs, so a caption set some other way still fits its half of the picture.
    const text = full.slice(0, CAPTION_MAX_LENGTH);
    if (!text.trim()) continue;
    const size = (captionSize(text) / 100) * width;
    const lineHeight = size * 0.95;
    ctx.font = `900 ${size}px ${captions.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(2, size * 0.12);
    ctx.strokeStyle = OUTLINE;
    ctx.fillStyle = captions.ink;
    const lines = wrapCaption(text.toUpperCase(), boxWidth, (line) => ctx.measureText(line).width);
    const start = edge === "top" ? height * 0.05 : height * 0.95 - lines.length * lineHeight;
    lines.forEach((line, i) => {
      const y = start + i * lineHeight;
      ctx.strokeText(line, width / 2, y);
      ctx.fillText(line, width / 2, y);
    });
  }
}

/** "meme-when-the-build-passes.png"; "meme.png" when both lines are empty. */
export function exportName(top: string, bottom: string): string {
  const slug = `${top} ${bottom}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48).replace(/-+$/, "");
  return slug ? `meme-${slug}.png` : "meme.png";
}

/** Renders the proof to a PNG blob in the browser. Rejects when the browser cannot draw or encode it. */
export async function renderPng(svg: SVGSVGElement, captions: { top: string; bottom: string; ink: string; family: string }): Promise<Blob> {
  const image = new Image();
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D canvas");
  ctx.drawImage(image, 0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
  drawCaptions(ctx, captions);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG encode failed"))), "image/png"));
}
