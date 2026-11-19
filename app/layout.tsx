import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

// The font variable sits on <html>: the App shell tokens live on :root and read it from there.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const description = "Write a top and bottom line on a picture, pick the ink colour and download a PNG, all in your browser.";

export const metadata: Metadata = {
  title: "Meme Generator | Bookchaowalit",
  description,
  keywords: ["meme generator", "caption", "tool"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL("https://meme-generator.bookchaowalit.com"),
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: "Meme Generator | Bookchaowalit", description, siteName: "Bookchaowalit" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body>{children}</body>
    </html>
  );
}
