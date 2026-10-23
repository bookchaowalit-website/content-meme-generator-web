import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/mcp/route";
import { PRESETS } from "@/lib/meme";

function rpc(body: unknown) {
  return POST(new Request("http://localhost/api/mcp", { method: "POST", body: JSON.stringify(body) }));
}

describe("MCP route", () => {
  it("echoes the JSON-RPC request id", async () => {
    const body = await (await rpc({ jsonrpc: "2.0", id: 7, method: "initialize" })).json();
    expect(body.id).toBe(7);
    expect(body.result.serverInfo.name).toBe("Meme Generator");
  });

  it("lists only the real tool", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 1, method: "tools/list" })).json();
    expect(result.tools.map((t: { name: string }) => t.name)).toEqual(["get_presets"]);
  });

  it("get_presets returns the same caption presets as the page", async () => {
    const { result } = await (await rpc({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_presets" } })).json();
    expect(result.presets).toEqual(PRESETS);
  });

  it("rejects an unknown tool instead of pretending to call it", async () => {
    const body = await (await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "render_meme" } })).json();
    expect(body.error.code).toBe(-32602);
    expect(body.id).toBe(3);
  });

  it("rejects an unknown method", async () => {
    const body = await (await rpc({ jsonrpc: "2.0", id: 4, method: "resources/list" })).json();
    expect(body.error.code).toBe(-32601);
  });

  it("answers a parse error for a body that is not JSON", async () => {
    const body = await (await POST(new Request("http://localhost/api/mcp", { method: "POST", body: "{" }))).json();
    expect(body.error.code).toBe(-32700);
    expect(body.id).toBeNull();
  });
});
