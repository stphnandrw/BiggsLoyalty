// ─── Utility ──────────────────────────────────────────────────────────────────
export function parseHtmlText(raw: string): string[] {
  if (!raw) return [];

  return raw
    .replace(/<br\s*\/?>/gi, "\n") // <br> → newline
    .replace(/<\/?[^>]+(>|$)/g, "") // strip all HTML tags
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function parseAndRemoveOtherLines(raw: string): string[] {
  if (!raw) return [];

  const lines = raw
    .replace(/<br\s*\/?>/gi, "\n") // <br> → newline
    .replace(/<\/?[^>]+(>|$)/g, "") // strip all HTML tags
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return lines.length > 0 ? [lines[0]] : [];
}
