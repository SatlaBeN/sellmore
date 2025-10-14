
import { describe, it, expect } from "vitest";
import { t } from "../lib/i18n";

describe("i18n dictionary", () => {
  it("falls back to key for unknown", () => {
    expect(t("en" as any, "__unknown__")).toBe("__unknown__");
  });
  it("returns translated value", () => {
    expect(t("he" as any, "nav_market")).toBe("חנות מוצרים");
  });
});
