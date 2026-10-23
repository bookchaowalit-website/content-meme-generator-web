import { describe, expect, it } from "vitest";
import { CAPTION_CHAR_EM, CAPTION_MAX_CQW, CAPTION_MIN_CQW, CAPTION_WIDTH_CQW, PRESETS, captionSize, nextPresetIndex } from "@/lib/meme";

describe("presets", () => {
  it("has three caption pairs and cycles through them", () => {
    expect(PRESETS).toHaveLength(3);
    expect(nextPresetIndex(0)).toBe(1);
    expect(nextPresetIndex(2)).toBe(0);
  });
});

describe("captionSize", () => {
  const width = (text: string) => text.length * CAPTION_CHAR_EM * captionSize(text);

  it("shrinks every preset caption so it fits the canvas width on one line", () => {
    for (const { top, bottom } of PRESETS) {
      expect(width(top)).toBeLessThanOrEqual(CAPTION_WIDTH_CQW);
      expect(width(bottom)).toBeLessThanOrEqual(CAPTION_WIDTH_CQW);
    }
  });

  it("keeps short captions at the largest size", () => {
    expect(captionSize("LOL")).toBe(CAPTION_MAX_CQW);
    expect(captionSize("")).toBe(CAPTION_MAX_CQW);
  });

  it("never goes below the smallest readable size for very long captions (they wrap instead)", () => {
    expect(captionSize("A".repeat(200))).toBe(CAPTION_MIN_CQW);
  });

  it("gets smaller as the caption gets longer", () => {
    expect(captionSize("WHEN THE BUILD PASSES")).toBeLessThan(captionSize("ON THE FIRST TRY"));
  });

  it("ignores spaces around the caption", () => {
    expect(captionSize("   LOL   ")).toBe(captionSize("LOL"));
  });
});
