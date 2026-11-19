import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://meme-generator.bookchaowalit.com/", changeFrequency: "monthly", priority: 1 }];
}
