import { describe, expect, it } from "vitest";
import { scanText } from "../src/detectors.js";

describe("scanText", () => {
  it("finds provider and cloud credentials in pasted text", () => {
    const findings = scanText(
      "OPENAI_API_KEY=sk-proj-123456789012345678901234\nAWS=AKIAIOSFODNN7EXAMPLE",
    );

    expect(findings.map((finding) => finding.kind)).toEqual([
      "secret-assignment",
      "aws-access-key",
    ]);
    expect(findings.every((finding) => finding.start < finding.end)).toBe(true);
  });

  it("finds private keys and bearer tokens", () => {
    const findings = scanText(
      "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\nAuthorization: Bearer abcdefghijklmnopqrstuvwxyz123456",
    );

    expect(findings.map((finding) => finding.kind)).toEqual([
      "private-key",
      "bearer-token",
    ]);
  });

  it("does not interrupt ordinary code or prose", () => {
    expect(scanText("const token = 'short';\nSay hello to the team.")).toEqual([]);
  });
});
