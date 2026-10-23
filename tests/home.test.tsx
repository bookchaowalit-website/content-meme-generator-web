import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("home page", () => {
  it("renders the first preset on the canvas, the ink picker and the local-only notice", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("Set the joke.");
    expect(html).toContain("WHEN THE BUILD PASSES");
    expect(html).toContain("ON THE FIRST TRY");
    expect(html).toContain("#f7f0da");
    expect(html).toContain("No image upload, account, or publishing service is attached.");
  });

  it("sizes each caption to fit the canvas", () => {
    const html = renderToString(<Home />);
    expect(html).toMatch(/top-caption" style="color:#f7f0da;font-size:[\d.]+cqw/);
  });
});
