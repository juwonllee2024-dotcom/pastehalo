import { readFile } from "node:fs/promises";
import { scanText } from "./detectors.js";
import { redactText } from "./redact.js";

const input = await readFile(new URL("../examples/seeded-paste.txt", import.meta.url), "utf8");
const findings = scanText(input);

process.stdout.write(`findings: ${findings.map((finding) => finding.kind).join(", ")}\n`);
process.stdout.write("redacted:\n");
process.stdout.write(`${redactText(input, findings)}\n`);
