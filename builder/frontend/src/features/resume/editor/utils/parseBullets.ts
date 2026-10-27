/**
 * AI endpoints return bullets either as an array or as one newline-separated
 * string. Normalise both to a clean string[].
 */
export function parseBullets(result: unknown): string[] {
  if (Array.isArray(result)) return result.map(String);

  if (typeof result === "string") {
    return result
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [];
}
