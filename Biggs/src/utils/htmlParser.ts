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
