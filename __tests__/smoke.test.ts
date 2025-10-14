
import { describe, it, expect, vi } from "vitest";
import { limit } from "../lib/rate";
import { verifyWhopToken } from "../lib/whop";

describe("rate limiter", () => {
  it("consumes without throwing for first call", async () => {
    await expect(limit("test-key")).resolves.toBeUndefined();
  });
});

describe("verifyWhopToken", () => {
  it("returns null on non-200", async () => {
    const spy = vi.spyOn(global, "fetch" as any).mockResolvedValue({ ok: false } as any);
    const res = await verifyWhopToken("bad");
    expect(res).toBeNull();
    spy.mockRestore();
  });
  it("parses json on 200", async () => {
    const data = { id: "u_123" } as any;
    const spy = vi.spyOn(global, "fetch" as any).mockResolvedValue({ ok: true, json: async () => data } as any);
    const res = await verifyWhopToken("good");
    expect(res).toEqual(data);
    spy.mockRestore();
  });
});
