import { describe, expect, it } from "vitest";
import { replaceSelection } from "../src/insert.js";

describe("replaceSelection", () => {
  it("returns the inserted value and new caret position", () => {
    expect(replaceSelection("hello secret world", 6, 12, "[REDACTED]")).toEqual({
      value: "hello [REDACTED] world",
      caret: 16,
    });
  });
});
