import type { Finding, FindingKind } from "./types.js";

interface Detector {
  kind: FindingKind;
  label: string;
  expression: RegExp;
  valueGroup?: number;
}

const detectors: Detector[] = [
  {
    kind: "private-key",
    label: "private key block",
    expression: /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z0-9 ]*PRIVATE KEY-----/g,
  },
  {
    kind: "secret-assignment",
    label: "secret-like assignment",
    expression:
      /(\b(?:[A-Z0-9][A-Z0-9_-]*(?:API[_-]?KEY|ACCESS[_-]?TOKEN|SECRET|PASSWORD|TOKEN)|api[_-]?key|access[_-]?token|secret|password|token)\b\s*[:=]\s*)(["'`]?)([^\s"'`,;]{12,})\2/gi,
    valueGroup: 3,
  },
  {
    kind: "aws-access-key",
    label: "AWS access key",
    expression: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    kind: "github-token",
    label: "GitHub token",
    expression: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g,
  },
  {
    kind: "google-api-key",
    label: "Google API key",
    expression: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    kind: "slack-token",
    label: "Slack token",
    expression: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    kind: "bearer-token",
    label: "Bearer token",
    expression: /\bBearer\s+([A-Za-z0-9._~+/=-]{20,})/gi,
    valueGroup: 1,
  },
  {
    kind: "jwt",
    label: "JWT",
    expression: /\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\b/g,
  },
];

function findingFromMatch(
  detector: Detector,
  match: RegExpExecArray,
): Finding {
  const fullStart = match.index;
  const value = detector.valueGroup === undefined ? match[0] : match[detector.valueGroup] ?? match[0];
  const relativeStart = detector.valueGroup === undefined ? 0 : match[0].indexOf(value);

  return {
    kind: detector.kind,
    label: detector.label,
    start: fullStart + relativeStart,
    end: fullStart + relativeStart + value.length,
  };
}

export function scanText(text: string): Finding[] {
  const candidates: Finding[] = [];

  for (const detector of detectors) {
    detector.expression.lastIndex = 0;
    let match = detector.expression.exec(text);
    while (match !== null) {
      candidates.push(findingFromMatch(detector, match));
      match = detector.expression.exec(text);
    }
  }

  candidates.sort((left, right) => {
    if (left.start !== right.start) return left.start - right.start;
    return right.end - right.start - (left.end - left.start);
  });

  const findings: Finding[] = [];
  for (const candidate of candidates) {
    const previous = findings.at(-1);
    if (previous !== undefined && candidate.start < previous.end) continue;
    findings.push(candidate);
  }
  return findings;
}
