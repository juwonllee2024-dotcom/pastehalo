export type FindingKind =
  | "aws-access-key"
  | "bearer-token"
  | "github-token"
  | "google-api-key"
  | "jwt"
  | "private-key"
  | "secret-assignment"
  | "slack-token";

export interface Finding {
  kind: FindingKind;
  label: string;
  start: number;
  end: number;
}
