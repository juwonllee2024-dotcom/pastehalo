import type { Finding } from "./types.js";

export function redactText(text: string, findings: Finding[]): string {
  let result = text;
  const ordered = [...findings].sort((left, right) => right.start - left.start);

  for (const finding of ordered) {
    result = `${result.slice(0, finding.start)}[REDACTED:${finding.kind}]${result.slice(finding.end)}`;
  }
  return result;
}
