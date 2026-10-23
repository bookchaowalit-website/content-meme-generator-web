"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_INK, PRESETS, captionSize, nextPresetIndex } from "@/lib/meme";

export default function Home() {
  const [top, setTop] = useState(PRESETS[0].top);
  const [bottom, setBottom] = useState(PRESETS[0].bottom);
  const [ink, setInk] = useState(DEFAULT_INK);
  const [preset, setPreset] = useState(0);

  function shuffle() {
    const next = nextPresetIndex(preset);
    setPreset(next); setTop(PRESETS[next].top); setBottom(PRESETS[next].bottom);
  }

  return (
    <main className="meme-shell">
      <header className="meme-topbar"><Link href="/" className="meme-mark">PRESS / LOL</Link><span>caption overlay studio</span><span>client-side only</span></header>
      <section className="meme-hero"><div><h1>Set the joke.<br /><em>Print the moment.</em></h1><p>A tiny caption press for quick ideas, internal jokes, and the moment a build finally behaves.</p></div><div className="ink-badge">INK<br />01</div></section>
      <section className="meme-workbench"><div className="caption-controls"><div className="control-head"><span>01 / Captions</span><button onClick={shuffle}>Shuffle preset ↻</button></div><label><span>Top line</span><input aria-label="Top caption" value={top} onChange={(event) => setTop(event.target.value)} /></label><label><span>Bottom line</span><input aria-label="Bottom caption" value={bottom} onChange={(event) => setBottom(event.target.value)} /></label><label className="ink-picker"><span>Ink color</span><input aria-label="Caption color" type="color" value={ink} onChange={(event) => setInk(event.target.value)} /><b>{ink}</b></label><p className="control-note">The canvas is a local proof. No image upload, account, or publishing service is attached.</p></div><figure className="meme-press"><div className="canvas-label"><span>02 / Live proof</span><span>800 × 450</span></div><div className="meme-canvas"><svg viewBox="0 0 800 450" role="img" aria-label="Abstract caption canvas illustration"><rect width="800" height="450" fill="#e4634c" /><circle cx="655" cy="72" r="130" fill="#f0ce4e" /><path d="M0 350 C150 265 245 390 370 315 C520 225 615 330 800 225 L800 450 L0 450Z" fill="#1b3f79" /><path d="M265 270 C285 190 420 172 475 270 L450 355 L285 355Z" fill="#f7f0da" /><circle cx="330" cy="250" r="25" fill="#1b3f79" /><circle cx="410" cy="250" r="25" fill="#1b3f79" /><circle cx="330" cy="250" r="8" fill="#f7f0da" /><circle cx="410" cy="250" r="8" fill="#f7f0da" /><path d="M335 303 Q370 326 407 303" fill="none" stroke="#1b3f79" strokeWidth="10" strokeLinecap="round" /><path d="M80 80 H230 M80 100 H180" stroke="#1b3f79" strokeWidth="10" /></svg><div className="caption top-caption" style={{ color: ink, fontSize: `${captionSize(top)}cqw` }}>{top}</div><div className="caption bottom-caption" style={{ color: ink, fontSize: `${captionSize(bottom)}cqw` }}>{bottom}</div></div><figcaption>Live caption overlay / local-only demo</figcaption></figure></section>
      <footer className="meme-footer"><span>BOOKCHAOWALIT / MEME GENERATOR</span><span>MAKE THE THING · KEEP THE RECEIPT</span></footer>
    </main>
  );
}
