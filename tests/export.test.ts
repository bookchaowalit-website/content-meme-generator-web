import { describe, expect, it } from "vitest";
import { EXPORT_WIDTH, OUTLINE, drawCaptions, exportName, wrapCaption, type CaptionContext } from "@/lib/export";
import { captionSize } from "@/lib/meme";

const measure = (line: string) => line.length * 10;

describe("wrapCaption", () => {
  it("packs words into lines", () => {
    expect(wrapCaption("aa bb cc", 50, measure)).toEqual(["aa bb", "cc"]);
    expect(wrapCaption("  ", 50, measure)).toEqual([]);
  });

  it("breaks a word wider than a line between characters, like overflow-wrap: anywhere", () => {
    expect(wrapCaption("supercalifragilistic ok", 50, measure)).toEqual(["super", "calif", "ragil", "istic", "ok"]);
    expect(wrapCaption("hi WWWWWWWWWWWW", 50, measure)).toEqual(["hi", "WWWWW", "WWWWW", "WW"]);
    const lines = wrapCaption("W".repeat(60), 300, measure);
    expect(lines.join("")).toBe("W".repeat(60));
    expect(lines.every((line) => measure(line) <= 300)).toBe(true);
    expect(wrapCaption("我们今天发布了新版本的软件", 40, measure)).toEqual(["我们今天", "发布了新", "版本的软", "件"]);
  });

  it("never splits a grapheme cluster", () => {
    const family = "👨‍👩‍👧";
    const lines = wrapCaption(family.repeat(3), 1, () => 2);
    expect(lines).toEqual([family, family, family]);
  });
});

function recorder() {
  const calls: { kind: string; text: string; y: number; font: string }[] = [];
  const ctx = {
    font: "", fillStyle: "", strokeStyle: "", lineWidth: 0, lineJoin: "miter", textAlign: "start", textBaseline: "alphabetic",
    measureText: (text: string) => ({ width: text.length * 20 }) as TextMetrics,
    fillText(text: string, _x: number, y: number) { calls.push({ kind: "fill", text, y, font: this.font }); },
    strokeText(text: string, _x: number, y: number) { calls.push({ kind: "stroke", text, y, font: this.font }); },
  };
  return { ctx: ctx as unknown as CaptionContext & { strokeStyle: string; fillStyle: string }, calls };
}

describe("drawCaptions", () => {
  it("draws both captions uppercase, outlined, top line near the top and bottom line ending near the bottom", () => {
    const { ctx, calls } = recorder();
    drawCaptions(ctx, { top: "hello there", bottom: "bye", ink: "#ffffff", family: "Geist" });
    expect(calls.map((c) => `${c.kind}:${c.text}`)).toEqual(["stroke:HELLO THERE", "fill:HELLO THERE", "stroke:BYE", "fill:BYE"]);
    expect(calls[0].y).toBe(45);
    const size = (captionSize("bye") / 100) * EXPORT_WIDTH;
    expect(calls[2].y).toBeCloseTo(900 * 0.95 - size * 0.95);
    expect(calls[0].font).toContain("900 ");
    expect(ctx.strokeStyle).toBe(OUTLINE);
    expect(ctx.fillStyle).toBe("#ffffff");
  });

  it("skips an empty line", () => {
    const { ctx, calls } = recorder();
    drawCaptions(ctx, { top: " ", bottom: "", ink: "#000", family: "x" });
    expect(calls).toEqual([]);
  });
});

describe("exportName", () => {
  it("slugs the captions and falls back to meme.png", () => {
    expect(exportName("When the build", "passes!")).toBe("meme-when-the-build-passes.png");
    expect(exportName("", " ")).toBe("meme.png");
    expect(exportName("a".repeat(60), "")).toBe(`meme-${"a".repeat(48)}.png`);
  });
});
