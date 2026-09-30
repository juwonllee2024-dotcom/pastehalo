import { describe, expect, it } from "vitest";
import { redactText } from "../src/redact.js";
import { scanText } from "../src/detectors.js";

describe("redactText", () => {
  it("replaces findings while preserving surrounding text", () => {
    const source = "curl -H 'Authorization: Bearer abcdefghijklmnopqrstuvwxyz123456' https://example.test";
    const result = redactText(source, scanText(source));

    expect(result).toBe("curl -H 'Authorization: Bearer [REDACTED:bearer-token]' https://example.test");
    expect(result).not.toContain("abcdefghijklmnopqrstuvwxyz123456");
  });
});
