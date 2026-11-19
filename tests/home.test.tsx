import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({ Geist: () => ({ variable: "geist-variable" }) }));

import Home from "@/app/page";
import RootLayout, { metadata } from "@/app/layout";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import nextConfig from "@/next.config";

describe("home page", () => {
  it("renders the first preset on the proof, the controls and the local-only note", () => {
    const html = renderToString(<Home />);
    expect(html).toContain("<h1>Meme Generator</h1>");
    expect(html).toContain("WHEN THE BUILD PASSES");
    expect(html).toContain("ON THE FIRST TRY");
    expect(html).toContain("#f7f0da");
    expect(html).toContain("Download PNG");
    expect(html).toContain("no upload, no account");
    expect(html).toContain('href="https://bookchaowalit.com/"');
  });

  it("sizes each caption to fit the canvas", () => {
    expect(renderToString(<Home />)).toMatch(/mg-top" style="color:#f7f0da;font-size:[\d.]+cqw/);
  });

  it("puts the font on <html> and uses its own domain", () => {
    expect(renderToString(<RootLayout><p>x</p></RootLayout>)).toContain('<html lang="en" class="geist-variable"');
    expect(String(metadata.metadataBase)).toBe("https://meme-generator.bookchaowalit.com/");
    expect(robots().sitemap).toBe("https://meme-generator.bookchaowalit.com/sitemap.xml");
    expect(sitemap()[0].url).toBe("https://meme-generator.bookchaowalit.com/");
  });

  it("sends the retired /more-projects page to the portfolio hub for good", async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true });
  });
});
