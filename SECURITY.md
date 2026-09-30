# Security policy

## Scope

PasteHalo is a local Chrome extension. Its security boundary includes the Manifest V3 permissions, paste listener, detector rules, redaction output, and review UI.

## Report a vulnerability

Please do not open a public issue for a report that could expose a real credential or bypass the review boundary. Use GitHub's private vulnerability reporting for this repository when available. Include:

- affected version and Chrome version;
- exact reproduction steps using fake data only;
- expected and observed behavior;
- whether any network request or automatic submission occurred.

If private reporting is unavailable, open a minimal issue without secrets and write `security-sensitive` in the title. Never paste a real token, private key, cookie, or password into an issue.

## Design promises

- no network requests;
- no clipboard history;
- no permanent host permission;
- no automatic Send;
- suspicious pastes require an explicit choice;
- tests cover representative high-confidence detectors and redaction.

These are design goals, not a promise that a browser or webpage is risk-free. Review the source and permissions before use.
