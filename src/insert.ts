export interface Replacement {
  value: string;
  caret: number;
}

export function replaceSelection(
  source: string,
  selectionStart: number,
  selectionEnd: number,
  replacement: string,
): Replacement {
  const start = Math.max(0, Math.min(selectionStart, source.length));
  const end = Math.max(start, Math.min(selectionEnd, source.length));
  return {
    value: `${source.slice(0, start)}${replacement}${source.slice(end)}`,
    caret: start + replacement.length,
  };
}
