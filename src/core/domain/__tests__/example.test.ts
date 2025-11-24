import { describe, it, expect } from "bun:test";

describe("Example Test Suite", () => {
  it("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should validate string operations", () => {
    const result = "Hello World";
    expect(result).toContain("World");
  });
});