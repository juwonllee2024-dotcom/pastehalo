import { scanText } from "./detectors.js";
import { replaceSelection } from "./insert.js";
import { redactText } from "./redact.js";
import type { Finding } from "./types.js";

type Editable = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

const REVIEW_ATTRIBUTE = "data-pastehalo-review";

function editableTarget(target: EventTarget | null): Editable | null {
  if (target instanceof HTMLTextAreaElement) return target;
  if (target instanceof HTMLInputElement) {
    const allowed = new Set(["text", "search", "url", "email", "tel"]);
    return allowed.has(target.type) ? target : null;
  }
  if (target instanceof HTMLElement && target.isContentEditable) return target;
  return null;
}

function dispatchPasteInput(target: Editable, data: string): void {
  target.dispatchEvent(new InputEvent("input", {
    bubbles: true,
    inputType: "insertFromPaste",
    data,
  }));
}

function insertIntoEditable(target: Editable, data: string): void {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const start = target.selectionStart ?? target.value.length;
    const end = target.selectionEnd ?? start;
    const replacement = replaceSelection(target.value, start, end, data);
    target.value = replacement.value;
    target.setSelectionRange(replacement.caret, replacement.caret);
    dispatchPasteInput(target, data);
    return;
  }

  const selection = window.getSelection();
  if (selection === null || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(data));
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  dispatchPasteInput(target, data);
}

function removeReview(): void {
  document.querySelector(`[${REVIEW_ATTRIBUTE}]`)?.remove();
}

function addButton(label: string, action: () => void, secondary = false): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.style.cssText = secondary
    ? "border:1px solid #aab5c9;background:#ffffff;color:#27324a;padding:8px 10px;border-radius:8px;cursor:pointer;"
    : "border:0;background:#27324a;color:#ffffff;padding:8px 10px;border-radius:8px;cursor:pointer;";
  button.addEventListener("click", action);
  return button;
}

function showReview(target: Editable, original: string, findings: Finding[]): void {
  removeReview();
  const host = document.createElement("div");
  host.setAttribute(REVIEW_ATTRIBUTE, "");
  const shadow = host.attachShadow({ mode: "closed" });

  const panel = document.createElement("section");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "PasteHalo secret review");
  panel.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:2147483647;width:min(420px,calc(100vw - 40px));box-sizing:border-box;background:#fffdf5;color:#27324a;border:1px solid #e2c15c;border-radius:14px;padding:16px;box-shadow:0 14px 40px rgba(22,31,53,.25);font:14px/1.45 system-ui,sans-serif;";

  const title = document.createElement("strong");
  title.textContent = "PasteHalo paused this paste";
  title.style.cssText = "display:block;font-size:16px;margin-bottom:5px;";
  panel.append(title);

  const description = document.createElement("p");
  description.textContent = `${findings.length} possible secret${findings.length === 1 ? "" : "s"} found locally. Nothing was sent.`;
  description.style.margin = "0 0 10px";
  panel.append(description);

  const list = document.createElement("ul");
  list.style.cssText = "margin:0 0 10px;padding-left:20px;";
  for (const finding of findings) {
    const item = document.createElement("li");
    item.textContent = finding.label;
    list.append(item);
  }
  panel.append(list);

  const preview = document.createElement("pre");
  preview.textContent = redactText(original, findings).slice(0, 700);
  preview.style.cssText = "max-height:120px;overflow:auto;white-space:pre-wrap;background:#f3f1e8;border-radius:8px;padding:9px;margin:0 0 12px;font:12px/1.4 ui-monospace,SFMono-Regular,Consolas,monospace;";
  panel.append(preview);

  const actions = document.createElement("div");
  actions.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end;";
  actions.append(
    addButton("Paste redacted", () => {
      insertIntoEditable(target, redactText(original, findings));
      removeReview();
    }),
    addButton("Paste original once", () => {
      insertIntoEditable(target, original);
      removeReview();
    }, true),
    addButton("Cancel", removeReview, true),
  );
  panel.append(actions);
  shadow.append(panel);
  document.documentElement.append(host);
}

function handlePaste(event: ClipboardEvent): void {
  const target = editableTarget(event.target);
  if (target === null) return;
  const text = event.clipboardData?.getData("text/plain") ?? "";
  if (text.length === 0) return;

  const findings = scanText(text);
  if (findings.length === 0) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  showReview(target, text, findings);
}

if (!document.documentElement.hasAttribute("data-pastehalo-installed")) {
  document.documentElement.setAttribute("data-pastehalo-installed", "");
  document.addEventListener("paste", handlePaste, true);
}
