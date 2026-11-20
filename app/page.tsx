"use client";

import { useRef, useState } from "react";
import { AppFoot, AppTop } from "@/components/app-shell";
import { exportName, renderPng } from "@/lib/export";
import { CAPTION_MAX_LENGTH, DEFAULT_INK, PRESETS, captionSize, nextPresetIndex } from "@/lib/meme";

const SOURCE = "https://github.com/bookchaowalit-website/content-meme-generator-web";

export default function Home() {
  const [top, setTop] = useState(PRESETS[0].top);
  const [bottom, setBottom] = useState(PRESETS[0].bottom);
  const [ink, setInk] = useState(DEFAULT_INK);
  const [preset, setPreset] = useState(0);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const empty = !top.trim() && !bottom.trim();

  function shuffle() {
    const next = nextPresetIndex(preset);
    setPreset(next);
    setTop(PRESETS[next].top);
    setBottom(PRESETS[next].bottom);
    setStatus(`Preset ${next + 1} of ${PRESETS.length}.`);
  }

  async function download() {
    if (!svgRef.current) return;
    setBusy(true);
    try {
      const family = captionRef.current ? getComputedStyle(captionRef.current).fontFamily || "sans-serif" : "sans-serif";
      const blob = await renderPng(svgRef.current, { top, bottom, ink, family });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = exportName(top, bottom);
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus(`Saved ${link.download} (1600 × 900).`);
    } catch {
      setStatus("This browser could not make the PNG. Take a screenshot of the proof instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="as">
      <a className="as-skip" href="#main">Skip to the editor</a>
      <AppTop name="Meme Generator" tagline="Two lines on a picture" />
      <main id="main" className="mg-page">
        <div className="as-head">
          <div>
            <h1>Meme Generator</h1>
            <p>Write a top and bottom line, pick the ink, download a PNG.</p>
          </div>
        </div>

        <div className="mg-grid">
          <figure className="mg-proof">
            <div className="mg-canvas">
              <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" role="img" aria-label="Cartoon face on a coral and navy background">
                <rect width="800" height="450" fill="#e4634c" /><circle cx="655" cy="72" r="130" fill="#f0ce4e" /><path d="M0 350 C150 265 245 390 370 315 C520 225 615 330 800 225 L800 450 L0 450Z" fill="#1b3f79" /><path d="M265 270 C285 190 420 172 475 270 L450 355 L285 355Z" fill="#f7f0da" /><circle cx="330" cy="250" r="25" fill="#1b3f79" /><circle cx="410" cy="250" r="25" fill="#1b3f79" /><circle cx="330" cy="250" r="8" fill="#f7f0da" /><circle cx="410" cy="250" r="8" fill="#f7f0da" /><path d="M335 303 Q370 326 407 303" fill="none" stroke="#1b3f79" strokeWidth="10" strokeLinecap="round" /><path d="M80 80 H230 M80 100 H180" stroke="#1b3f79" strokeWidth="10" />
              </svg>
              <div ref={captionRef} className="mg-caption mg-top" style={{ color: ink, fontSize: `${captionSize(top)}cqw` }}>{top}</div>
              <div className="mg-caption mg-bottom" style={{ color: ink, fontSize: `${captionSize(bottom)}cqw` }}>{bottom}</div>
              {empty ? <p className="mg-placeholder">Type a top or bottom line to caption the picture.</p> : null}
            </div>
            <figcaption className="as-sr">Live preview of the meme</figcaption>
          </figure>

          <section className="as-composer mg-controls" aria-labelledby="mg-controls-title">
            <div className="mg-controls-head">
              <h2 id="mg-controls-title">Captions</h2>
              <button type="button" className="as-plain" onClick={shuffle}>Shuffle preset</button>
            </div>
            <label className="as-field">Top line<input value={top} maxLength={CAPTION_MAX_LENGTH} onChange={(event) => setTop(event.target.value)} autoComplete="off" /></label>
            <label className="as-field">Bottom line<input value={bottom} maxLength={CAPTION_MAX_LENGTH} onChange={(event) => setBottom(event.target.value)} autoComplete="off" /></label>
            <label className="mg-ink">
              <input type="color" value={ink} onChange={(event) => setInk(event.target.value)} />
              <span>Ink colour <span className="mg-hex">{ink}</span></span>
            </label>
            <button type="button" className="as-button" onClick={download} disabled={busy}>Download PNG</button>
            <p className="mg-status" role="status">{status}</p>
          </section>
        </div>

        <p className="as-note">Everything happens in this browser: no upload, no account, nothing is published. The picture is one authored drawing; the PNG is made on your device.</p>
      </main>
      <AppFoot source={SOURCE} />
    </div>
  );
}
