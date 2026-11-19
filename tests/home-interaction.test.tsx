// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;
const $ = (selector: string) => host.querySelector(selector) as HTMLElement;
const button = (text: string) => [...host.querySelectorAll("button")].find((b) => b.textContent?.trim().startsWith(text)) as HTMLButtonElement;
const press = async (el: Element) => { await act(async () => { el.dispatchEvent(new MouseEvent("click", { bubbles: true })); }); };
const field = (label: string) => [...host.querySelectorAll("label")].find((l) => l.textContent?.startsWith(label))!.querySelector("input") as HTMLInputElement;
function type(el: HTMLInputElement, value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root.render(<Home />));
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("meme generator", () => {
  it("updates the proof as you type and shows a placeholder when both lines are empty", () => {
    type(field("Top line"), "hello");
    expect($(".mg-top").textContent).toBe("hello");
    expect(host.querySelector(".mg-placeholder")).toBeNull();
    type(field("Top line"), "");
    type(field("Bottom line"), "");
    expect($(".mg-placeholder").textContent).toContain("Type a top or bottom line");
  });

  it("shuffles to the next preset and says which", async () => {
    await press(button("Shuffle preset"));
    expect($(".mg-top").textContent).toBe("ME: I WILL KEEP IT SIMPLE");
    expect($('[role="status"]').textContent).toBe("Preset 2 of 3.");
  });

  it("changes the ink colour", () => {
    type(host.querySelector('input[type="color"]') as HTMLInputElement, "#00ff00");
    expect($(".mg-top").style.color).toMatch(/#00ff00|rgb\(0, 255, 0\)/);
    expect($(".mg-hex").textContent).toBe("#00ff00");
  });

  it("downloads a PNG made on a canvas", async () => {
    vi.spyOn(HTMLImageElement.prototype, "decode").mockResolvedValue(undefined);
    const ctx = { drawImage: vi.fn(), fillText: vi.fn(), strokeText: vi.fn(), measureText: () => ({ width: 10 }) };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as never);
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((cb: BlobCallback) => cb(new Blob(["x"], { type: "image/png" })));
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: vi.fn(() => "blob:x"), revokeObjectURL: vi.fn() }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    await press(button("Download PNG"));
    expect(ctx.drawImage).toHaveBeenCalled();
    expect(ctx.fillText).toHaveBeenCalledWith("WHEN THE BUILD PASSES", 800, expect.any(Number));
    expect(click).toHaveBeenCalled();
    expect($('[role="status"]').textContent).toBe("Saved meme-when-the-build-passes-on-the-first-try.png (1600 × 900).");
  });

  it("says so when the browser cannot make the PNG", async () => {
    vi.spyOn(HTMLImageElement.prototype, "decode").mockRejectedValue(new Error("no"));
    await press(button("Download PNG"));
    expect($('[role="status"]').textContent).toContain("could not make the PNG");
    expect(button("Download PNG").disabled).toBe(false);
  });
});
