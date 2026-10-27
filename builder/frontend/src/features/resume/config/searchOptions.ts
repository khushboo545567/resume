/*
 * Shared matcher behind the suggestion dropdowns (SuggestInput).
 *
 * List order = popularity order: it decides what is shown before the user
 * types anything and breaks ties between equally good matches. `aliases` let
 * people find an entry by the name they actually type ("btech", "bangalore").
 */

export interface Option {
  name: string;
  aliases?: string[];
  /**
   * What word-by-word and "contains" matching looks at, when that should be
   * only part of `name` (a city, without its ", India" suffix).
   */
  matchOn?: string;
}

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]/g, "");

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);

function score(option: Option, query: string, queryWords: string[]): number {
  const full = normalize(option.name);
  const name = normalize(option.matchOn ?? option.name);

  // Start of the title, spaces and punctuation ignored.
  if (name.startsWith(query) || full.startsWith(query)) return 0;

  if (option.aliases?.some((alias) => normalize(alias).startsWith(query))) {
    return 1;
  }

  // Every typed word starts a different word of the title ("dev front").
  const optionWords = words(option.matchOn ?? option.name);
  if (queryWords.every((q) => optionWords.some((word) => word.startsWith(q)))) {
    return 2;
  }

  // Matching in the middle of a word is only trustworthy for longer input:
  // "py" would otherwise find "copywriter".
  if (query.length < 4) return -1;

  if (name.includes(query)) return 3;

  if (option.aliases?.some((alias) => normalize(alias).includes(query))) {
    return 4;
  }

  return -1;
}

/**
 * Best matches for what the user has typed so far.
 * `exclude` hides entries that are already chosen (tags, added languages).
 */
export function searchOptions(
  list: Option[],
  input: string,
  limit = 6,
  exclude: string[] = [],
): string[] {
  const skip = new Set(exclude.map((name) => name.trim().toLowerCase()));
  const available = list.filter((o) => !skip.has(o.name.toLowerCase()));

  const query = normalize(input);
  if (!query) return available.slice(0, limit).map((o) => o.name);

  const queryWords = words(input);

  return available
    .map((option, index) => ({
      name: option.name,
      index,
      rank: score(option, query, queryWords),
    }))
    .filter((match) => match.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((match) => match.name);
}
