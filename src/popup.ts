const enableButton = document.querySelector<HTMLButtonElement>("#enable");
const statusElement = document.querySelector<HTMLParagraphElement>("#status");

function setStatus(message: string, error = false): void {
  if (statusElement === null) return;
  statusElement.textContent = message;
  statusElement.dataset.error = error ? "true" : "false";
}

enableButton?.addEventListener("click", async () => {
  setStatus("Enabling on this tab…");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id === undefined) {
    setStatus("No active tab found.", true);
    return;
  }

  try {
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
    setStatus("Enabled. Paste into the page to see the review.");
  } catch {
    setStatus("Chrome blocks extensions on this page. Try an ordinary web tab.", true);
  }
});

export {};
