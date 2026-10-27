/*
 * Suggestions for the Education form (Degree, Field of Study).
 *
 * Same idea as jobRoles.ts: list order = popularity order, `aliases` let people
 * find an entry by the short name they actually type ("btech", "cse", "mba").
 */

import { searchOptions, type Option } from "./searchOptions";

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
  { name: "Biotechnology", aliases: ["biotech"] },
  { name: "Aerospace Engineering", aliases: ["aeronautical"] },
  { name: "Automobile Engineering", aliases: ["automotive"] },
  { name: "Instrumentation Engineering", aliases: ["instrumentation"] },
  { name: "Industrial Engineering", aliases: ["production"] },
  { name: "Environmental Science", aliases: ["environment"] },
  { name: "Pharmacy", aliases: ["pharma"] },
  { name: "Nursing" },
  { name: "Psychology" },
  { name: "Statistics", aliases: ["stats"] },
  { name: "Graphic Design", aliases: ["design", "animation"] },
  { name: "Mass Communication", aliases: ["journalism", "media"] },
  { name: "Law", aliases: ["llb", "legal studies"] },
];

export const searchDegrees = (input: string, limit = 6) =>
  searchOptions(DEGREES, input, limit);

export const searchFieldsOfStudy = (input: string, limit = 6) =>
  searchOptions(FIELDS_OF_STUDY, input, limit);
