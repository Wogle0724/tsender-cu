

import { describe, it, expect } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("returns 0 for an empty string", () => {
    expect(calculateTotal("")).toBe(0);
  });

  it("returns 0 for whitespace-only input", () => {
    expect(calculateTotal("   \n  \r\n\t")).toBe(0);
  });

  it("sums newline-separated integers", () => {
    expect(calculateTotal("100\n200\n300")).toBe(600);
  });

  it("sums comma-separated integers", () => {
    expect(calculateTotal("1,2,3")).toBe(6);
  });

  it("handles mixed commas and newlines (including CRLF)", () => {
    expect(calculateTotal("10\r\n20,30\n40")).toBe(100);
  });

  it("trims spaces around values", () => {
    expect(calculateTotal(" 10 \n  20  , 30 ")).toBe(60);
  });

  it("supports decimals", () => {
    expect(calculateTotal("0.1\n0.2\n0.3")).toBeCloseTo(0.6, 10);
  });

  it("ignores empty entries created by consecutive separators", () => {
    expect(calculateTotal("1\n\n2,,3,\n")).toBe(6);
  });

  it("ignores non-numeric tokens", () => {
    expect(calculateTotal("10\nabc\n20,xyz,30")).toBe(60);
  });

  it("treats null/undefined/non-string as 0 (runtime guard)", () => {
    expect(calculateTotal(undefined as any)).toBe(0);
    expect(calculateTotal(null as any)).toBe(0);
    expect(calculateTotal(123 as any)).toBe(0);
  });
});