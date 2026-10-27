/* Spoken-language suggestions for the Languages section. */

import { searchOptions, type Option } from "./searchOptions";

const LANGUAGES: Option[] = [
  { name: "English" },
  { name: "Hindi" },
  { name: "Marathi" },
  { name: "Gujarati" },
  { name: "Bengali", aliases: ["bangla"] },
  { name: "Tamil" },
  { name: "Telugu" },
  { name: "Kannada" },
  { name: "Malayalam" },
  { name: "Punjabi", aliases: ["panjabi"] },
  { name: "Urdu" },
  { name: "Odia", aliases: ["oriya"] },
  { name: "Assamese" },
  { name: "Sanskrit" },
  { name: "Bhojpuri" },
  { name: "Rajasthani", aliases: ["marwari"] },
  { name: "Maithili" },
  { name: "Konkani" },
  { name: "Kashmiri" },
  { name: "Sindhi" },
  { name: "Nepali" },
  { name: "Spanish" },
  { name: "French" },
  { name: "German" },
  { name: "Japanese" },
  { name: "Mandarin Chinese", aliases: ["chinese", "mandarin"] },
  { name: "Korean" },
  { name: "Arabic" },
  { name: "Portuguese" },
  { name: "Russian" },
  { name: "Italian" },
  { name: "Dutch" },
];

/** `exclude` hides languages that are already on the resume. */
export const searchLanguages = (input: string, exclude: string[] = [], limit = 6) =>
  searchOptions(LANGUAGES, input, limit, exclude);
