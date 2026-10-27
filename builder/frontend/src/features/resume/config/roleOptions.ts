/*
 * Role suggestions for the Internship "Role" field and the Project "Role"
 * field. Job-title suggestions for everything else live in jobRoles.ts.
 */

import { searchOptions, type Option } from "./searchOptions";
import { searchRoles } from "./jobRoles";

const INTERNSHIP_ROLES: Option[] = [
  { name: "Software Development Intern", aliases: ["sde intern", "swe intern", "software engineer intern"] },
  { name: "Web Development Intern", aliases: ["web developer intern"] },
  { name: "Frontend Developer Intern", aliases: ["front end intern", "react intern"] },
  { name: "Backend Developer Intern", aliases: ["back end intern", "node intern"] },
  { name: "Full Stack Developer Intern", aliases: ["fullstack intern", "mern intern"] },
  { name: "Data Science Intern", aliases: ["data scientist intern"] },
  { name: "Machine Learning Intern", aliases: ["ml intern", "ai intern", "ai ml intern"] },
  { name: "Data Analyst Intern", aliases: ["analytics intern"] },
  { name: "Mobile App Development Intern", aliases: ["android intern", "flutter intern", "ios intern"] },
  { name: "Python Developer Intern", aliases: ["django intern"] },
  { name: "Java Developer Intern" },
  { name: "UI/UX Design Intern", aliases: ["ux intern", "ui intern", "figma intern"] },
  { name: "Graphic Design Intern" },
  { name: "DevOps Intern", aliases: ["cloud intern"] },
  { name: "Cyber Security Intern", aliases: ["security intern"] },
  { name: "QA / Testing Intern", aliases: ["qa intern", "test intern", "sdet intern"] },
  { name: "Business Analyst Intern" },
  { name: "Product Management Intern", aliases: ["pm intern", "product intern"] },
  { name: "Digital Marketing Intern", aliases: ["marketing intern", "seo intern"] },
  { name: "Content Writing Intern", aliases: ["content intern", "writer intern"] },
  { name: "Human Resources Intern", aliases: ["hr intern"] },
  { name: "Research Intern", aliases: ["research assistant intern"] },
  { name: "Technical Support Intern" },
];

const PROJECT_ROLES: Option[] = [
  { name: "Full Stack Developer", aliases: ["fullstack", "mern"] },
  { name: "Frontend Developer", aliases: ["front end", "ui developer"] },
  { name: "Backend Developer", aliases: ["back end", "api developer"] },
  { name: "Solo Developer", aliases: ["individual", "sole developer", "personal project"] },
  { name: "Team Lead", aliases: ["project lead", "lead developer", "tech lead"] },
  { name: "Mobile App Developer", aliases: ["android", "flutter", "react native"] },
  { name: "UI/UX Designer", aliases: ["designer", "figma"] },
  { name: "Machine Learning Engineer", aliases: ["ml", "ai", "model developer"] },
  { name: "Data Analyst", aliases: ["analytics", "dashboard"] },
  { name: "Database Designer", aliases: ["dba", "schema"] },
  { name: "DevOps Engineer", aliases: ["deployment", "ci cd"] },
  { name: "Game Developer", aliases: ["unity"] },
  { name: "Tester", aliases: ["qa", "testing"] },
  { name: "Researcher", aliases: ["research"] },
];

export const searchInternshipRoles = (input: string, limit = 6) =>
  searchOptions(INTERNSHIP_ROLES, input, limit);

/** Project-style roles first, then general job titles to fill the list. */
export function searchProjectRoles(input: string, limit = 6): string[] {
  const own = searchOptions(PROJECT_ROLES, input, limit);
  if (!input.trim() || own.length >= limit) return own;

  const taken = new Set(own.map((name) => name.toLowerCase()));
  const extra = searchRoles(input, limit).filter(
    (name) => !taken.has(name.toLowerCase()),
  );

  return [...own, ...extra].slice(0, limit);
}
