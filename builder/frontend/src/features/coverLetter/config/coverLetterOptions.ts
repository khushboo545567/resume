/*
 * Suggestions for the cover letter forms. Same idea as the resume lists in
 * features/resume/config: suggestions only save typing, they never restrict
 * what the user can write.
 */

import {
  searchOptions,
  type Option,
} from "../../resume/config/searchOptions";

const toOptions = (names: string[]): Option[] =>
  [...new Set(names)].map((name) => ({ name }));

/* ---------- sign-off ---------- */

const SIGN_OFFS: Option[] = [
  { name: "Sincerely," },
  { name: "Best regards," },
  { name: "Kind regards," },
  { name: "Warm regards," },
  { name: "Yours sincerely," },
  { name: "Respectfully," },
  { name: "Thank you," },
];

export const searchSignOffs = (input: string) =>
  searchOptions(SIGN_OFFS, input, SIGN_OFFS.length);

/* ---------- recipient + greeting ---------- */

const RECIPIENT_NAMES: Option[] = [
  { name: "Hiring Manager" },
  { name: "Hiring Team" },
  { name: "Recruitment Team" },
  { name: "HR Manager", aliases: ["human resources"] },
  { name: "Talent Acquisition Team", aliases: ["ta team", "recruiter"] },
];

export const searchRecipientNames = (input: string) =>
  searchOptions(RECIPIENT_NAMES, input, RECIPIENT_NAMES.length);

/** "Dear <recipient>," first (when they named someone), then the usual ones. */
export function searchGreetings(input: string, recipientName: string) {
  const name = recipientName.trim();

  return searchOptions(
    toOptions([
      ...(name ? [`Dear ${name},`] : []),
      "Dear Hiring Manager,",
      "Dear Hiring Team,",
      "Dear Recruitment Team,",
      "To Whom It May Concern,",
      "Hello,",
    ]),
    input,
    6,
  );
}

/* ---------- subject line ---------- */

/** Subject lines built from what is already on the letter. */
export function searchSubjects(
  input: string,
  details: { role: string; company: string; fullName: string },
) {
  const role = details.role.trim();
  if (!role) return [];

  const company = details.company.trim();
  const fullName = details.fullName.trim();

  return searchOptions(
    toOptions([
      `Application for ${role} Position`,
      ...(company ? [`Application for ${role} Position at ${company}`] : []),
      `Application for ${role} Role`,
      `Application for ${role} Internship`,
      ...(fullName ? [`${role} Application - ${fullName}`] : []),
    ]),
    input,
    5,
  );
}

/* ---------- date ---------- */

export const todayLong = () =>
  new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ---------- regenerate with AI ---------- */

export const REGENERATE_PRESETS = [
  "Make it shorter",
  "Make it more concise",
  "Sound more confident",
  "Make it more formal",
  "Make it less formal",
  "Highlight my projects",
  "Highlight my skills",
  "Focus on leadership",
  "Show more enthusiasm",
  "Match the job description more closely",
];
