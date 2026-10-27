/*
 * Suggestions for the Education form (Degree, Field of Study).
 *
 * Same idea as jobRoles.ts: list order = popularity order, `aliases` let people
 * find an entry by the short name they actually type ("btech", "cse", "mba").
 */

interface Option {
  name: string;
  aliases?: string[];
}

const DEGREES: Option[] = [
  { name: "B.Tech", aliases: ["btech", "bachelor of technology", "b.e", "be"] },
  { name: "B.E.", aliases: ["be", "bachelor of engineering"] },
  { name: "M.Tech", aliases: ["mtech", "master of technology"] },
  { name: "BCA", aliases: ["bachelor of computer applications"] },
  { name: "MCA", aliases: ["master of computer applications"] },
  { name: "B.Sc", aliases: ["bsc", "bachelor of science"] },
  { name: "M.Sc", aliases: ["msc", "master of science"] },
  { name: "B.Com", aliases: ["bcom", "bachelor of commerce"] },
  { name: "M.Com", aliases: ["mcom", "master of commerce"] },
  { name: "BBA", aliases: ["bachelor of business administration"] },
  { name: "MBA", aliases: ["master of business administration", "pgdm"] },
  { name: "B.A.", aliases: ["ba", "bachelor of arts"] },
  { name: "M.A.", aliases: ["ma", "master of arts"] },
  { name: "Diploma", aliases: ["polytechnic"] },
  { name: "PhD", aliases: ["doctorate", "doctor of philosophy"] },
  { name: "Class XII", aliases: ["12th", "intermediate", "hsc", "senior secondary"] },
  { name: "Class X", aliases: ["10th", "matriculation", "ssc", "secondary"] },
];

const FIELDS_OF_STUDY: Option[] = [
  { name: "Computer Science and Engineering", aliases: ["cse", "cs", "computer science"] },
  { name: "Information Technology", aliases: ["it"] },
  { name: "Artificial Intelligence and Machine Learning", aliases: ["aiml", "ai ml", "ai"] },
  { name: "Data Science", aliases: ["ds"] },
  { name: "Electronics and Communication Engineering", aliases: ["ece", "electronics"] },
  { name: "Electrical Engineering", aliases: ["ee", "eee", "electrical"] },
  { name: "Mechanical Engineering", aliases: ["me", "mechanical"] },
  { name: "Civil Engineering", aliases: ["ce", "civil"] },
  { name: "Chemical Engineering", aliases: ["chemical"] },
  { name: "Software Engineering" },
  { name: "Cyber Security", aliases: ["cybersecurity", "information security"] },
  { name: "Computer Applications", aliases: ["bca", "mca"] },
  { name: "Mathematics", aliases: ["maths"] },
  { name: "Physics" },
  { name: "Chemistry" },
  { name: "Business Administration", aliases: ["management", "bba", "mba"] },
  { name: "Commerce", aliases: ["accounting", "finance"] },
  { name: "Economics" },
  { name: "English Literature", aliases: ["english"] },
  { name: "Science", aliases: ["pcm", "pcb"] },
];

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]/g, "");

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);

function score(option: Option, query: string, queryWords: string[]): number {
  const name = normalize(option.name);

  if (name.startsWith(query)) return 0;

  if (option.aliases?.some((alias) => normalize(alias).startsWith(query))) {
    return 1;
  }

  const optionWords = words(option.name);
  if (queryWords.every((q) => optionWords.some((word) => word.startsWith(q)))) {
    return 2;
  }

  // Matching in the middle of a word is only trustworthy for longer input.
  if (query.length < 4) return -1;

  return name.includes(query) ? 3 : -1;
}

function search(list: Option[], input: string, limit: number): string[] {
  const query = normalize(input);
  if (!query) return list.slice(0, limit).map((option) => option.name);

  const queryWords = words(input);

  return list
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

export const searchDegrees = (input: string, limit = 6) =>
  search(DEGREES, input, limit);

export const searchFieldsOfStudy = (input: string, limit = 6) =>
  search(FIELDS_OF_STUDY, input, limit);
