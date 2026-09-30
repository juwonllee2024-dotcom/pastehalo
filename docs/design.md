# PasteHalo design — 2026-09-30

## Problem

People paste logs, configuration, and code into AI chats. A single copied API key or bearer token can leave the machine before the user notices. Existing secret scanners mostly run in repositories, terminals, or server gateways; they do not sit at the exact paste moment in the browser composer.

## Innovation hypothesis

If a browser extension pauses only suspicious pastes, shows the exact finding, and lets the user choose a redacted or original paste, people will keep it enabled because the protection appears at the moment of highest risk without blocking ordinary text.

## Product boundary

- Chrome Manifest V3.
- User clicks **Enable on this tab**; no permanent host permission.
- Paste interception is local and opt-in per tab.
- High-confidence patterns only: provider tokens, cloud keys, private keys, bearer tokens, JWTs, and secret-like assignments.
- No network, account, telemetry, clipboard history, DOM scraping, or automatic Send.
- User chooses: paste redacted, paste original once, or cancel.

## Core flow

1. Open an AI chat or any web composer.
2. Click PasteHalo and choose **Enable on this tab**.
3. Paste normally.
4. If suspicious text is found, review the finding types and preview.
5. Choose redacted paste, original once, or cancel.

## Candidate review

| Candidate | Pain | Novelty | Build today | Shareability | OSS fit | Total | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| PasteHalo | 5 | 4 | 5 | 5 | 5 | 24 | Selected |
| ContextBorrow | 4 | 3 | 4 | 4 | 5 | 20 | Reject: overlaps Tab2Patch |
| ErrorZip | 4 | 3 | 4 | 4 | 4 | 19 | Reject: overlaps Failcase/Reprocard |
| OutsideClick | 3 | 4 | 5 | 3 | 4 | 19 | Reject: narrower browser-routing pain |

## Evidence and assumptions

- Confirmed: OpenAI Codex users requested a local pre-submit redaction layer because prompts can contain passwords, API keys, bearer tokens, private keys, cookies, and `.env` contents. See [Codex issue #25585](https://github.com/openai/codex/issues/25585).
- Confirmed: GitHub documents that secrets can enter logs through stdout/stderr and recommends masking sensitive values. See [GitHub secure-use reference](https://docs.github.com/en/actions/reference/security/secure-use).
- Confirmed: GitHub community users report that AI assistants may not read local files automatically, forcing copy/paste context. See [Copilot discussion #163043](https://github.com/orgs/community/discussions/163043).
- Confirmed: Similar tools exist, including CLI and macOS clipboard approaches. The wedge here is an opt-in, per-tab browser interception flow with no background clipboard watcher.
- Hypothesis: A visible review at paste time will prevent more accidental leaks than repository-only scanning.
- Hypothesis: The five-second demo (paste a fake key, see a choice) is easy to share and understand.

## Seven-day experiment

Give the unpacked extension to five AI-heavy developers. Ask each to paste three benign snippets and one seeded fake key. Measure: activation success, false-positive complaints, redacted-choice rate, and whether they enable it on a second day. Stop or pivot if the seeded leak demo is not understood in ten seconds.

## Business hypothesis

- First users: developers who paste logs/configuration into ChatGPT, Claude, Gemini, or support tools.
- First ten users: current GitHub followers/issue commenters of local-first developer tools and one public developer community post after a real demo exists.
- Free offer: MIT-licensed local extension.
- Possible paid path later: team policy packs or managed rule updates; not part of MVP and not required for use.

## Success gate

Today counts as a build success only if a fresh install passes tests, the extension builds, a seeded secret produces a reviewable decision, and the public repository contains the verification record. Adoption and stars remain unverified.
