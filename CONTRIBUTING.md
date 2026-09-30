# Contributing

Thanks for improving PasteHalo.

## Before opening a change

- Keep detection local and deterministic.
- Never add telemetry, remote rule downloads, clipboard history, or automatic submission.
- Use fake credentials in tests and examples.
- Add a focused test before changing detector or redaction behavior.
- Explain false-positive and false-negative trade-offs in the pull request.

## Verify locally

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

## Pull requests

Describe the user problem, the smallest behavior change, security impact, and how you tested it. Keep provider-specific changes isolated and avoid unrelated refactors.
