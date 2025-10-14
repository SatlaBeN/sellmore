
import { describe, it, expect } from "vitest";

describe("root index.tsx syntax", () => {
  it("module loads and exports re-exports", async () => {
    const mod = await import("../index.tsx");
    expect(mod).toBeTruthy();
  });
});
