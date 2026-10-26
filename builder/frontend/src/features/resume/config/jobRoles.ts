/*
 * Role suggestions for "Target role" fields.
 *
 * The list order is the popularity order: it decides which roles are shown
 * before the user types anything, and breaks ties between equally good
 * matches. `aliases` let people find a role with the name they actually use
 * ("sde", "ml", "ui/ux") even though it is not part of the role title.
 */

interface RoleEntry {
  name: string;
  aliases?: string[];
}

const ROLES: RoleEntry[] = [
  // ── Software engineering ──
  { name: "Frontend Developer", aliases: ["front end", "ui developer"] },
  { name: "Backend Developer", aliases: ["back end", "server side"] },
  { name: "Full Stack Developer", aliases: ["fullstack", "mern", "mean"] },
  { name: "Software Engineer", aliases: ["swe", "sde", "software developer"] },
  { name: "Software Development Engineer", aliases: ["sde"] },
  { name: "React Developer", aliases: ["reactjs", "react js"] },
  { name: "Node.js Developer", aliases: ["nodejs", "node js", "express"] },
  { name: "JavaScript Developer", aliases: ["js developer"] },
  { name: "TypeScript Developer", aliases: ["ts developer"] },
  { name: "Python Developer", aliases: ["django", "flask"] },
  { name: "Java Developer", aliases: ["spring boot", "j2ee"] },
  { name: ".NET Developer", aliases: ["dotnet", "c#", "asp.net"] },
  { name: "PHP Developer", aliases: ["laravel"] },
  { name: "Angular Developer" },
  { name: "Vue.js Developer", aliases: ["vuejs", "vue js"] },
  { name: "Next.js Developer", aliases: ["nextjs", "next js"] },
  { name: "Web Developer", aliases: ["website developer"] },
  { name: "WordPress Developer" },
  { name: "Mobile App Developer", aliases: ["app developer"] },
  { name: "Android Developer", aliases: ["kotlin"] },
  { name: "iOS Developer", aliases: ["swift"] },
  { name: "Flutter Developer", aliases: ["dart"] },
  { name: "React Native Developer" },
  { name: "Game Developer", aliases: ["unity", "unreal"] },
  { name: "Embedded Systems Engineer", aliases: ["firmware"] },
  { name: "Blockchain Developer", aliases: ["web3", "solidity"] },
  { name: "Golang Developer", aliases: ["go developer"] },
  { name: "Rust Developer" },
  { name: "C++ Developer" },
  { name: "Software Architect", aliases: ["solution architect"] },
  { name: "Senior Software Engineer", aliases: ["sse"] },
  { name: "Engineering Manager", aliases: ["em"] },
  { name: "Technical Lead", aliases: ["tech lead", "team lead"] },
  { name: "Software Engineer Intern", aliases: ["sde intern", "internship"] },

  // ── Data, AI ──
  { name: "Data Analyst", aliases: ["da"] },
  { name: "Data Scientist", aliases: ["ds"] },
  { name: "Data Engineer", aliases: ["etl", "big data"] },
  { name: "Machine Learning Engineer", aliases: ["ml engineer", "mle"] },
  { name: "AI Engineer", aliases: ["artificial intelligence", "genai", "llm"] },
  { name: "AI/ML Engineer", aliases: ["ai ml"] },
  { name: "Deep Learning Engineer" },
  { name: "NLP Engineer", aliases: ["natural language processing"] },
  { name: "Computer Vision Engineer" },
  { name: "Prompt Engineer" },
  { name: "Business Intelligence Analyst", aliases: ["bi analyst", "power bi", "tableau"] },
  { name: "Business Analyst", aliases: ["ba"] },
  { name: "Research Scientist" },
  { name: "Statistician" },

  // ── Cloud, DevOps, security, QA ──
  { name: "DevOps Engineer", aliases: ["ci cd"] },
  { name: "Cloud Engineer", aliases: ["aws", "azure", "gcp"] },
  { name: "Cloud Architect" },
  { name: "Site Reliability Engineer", aliases: ["sre"] },
  { name: "Platform Engineer" },
  { name: "Systems Administrator", aliases: ["sysadmin"] },
  { name: "Network Engineer" },
  { name: "Database Administrator", aliases: ["dba", "sql"] },
  { name: "Cybersecurity Analyst", aliases: ["cyber security", "infosec", "security analyst"] },
  { name: "Security Engineer" },
  { name: "Penetration Tester", aliases: ["pentester", "ethical hacker"] },
  { name: "QA Engineer", aliases: ["quality assurance", "tester"] },
  { name: "Automation Test Engineer", aliases: ["sdet", "selenium"] },
  { name: "Manual Tester" },
  { name: "Technical Support Engineer", aliases: ["it support", "helpdesk"] },
  { name: "IT Support Specialist" },

  // ── Design, product, content ──
  { name: "UI/UX Designer", aliases: ["ux designer", "ui designer", "product designer"] },
  { name: "Graphic Designer" },
  { name: "Product Designer" },
  { name: "Product Manager", aliases: ["pm", "apm"] },
  { name: "Project Manager", aliases: ["pm"] },
  { name: "Program Manager" },
  { name: "Scrum Master", aliases: ["agile"] },
  { name: "Technical Writer", aliases: ["documentation"] },
  { name: "Content Writer", aliases: ["copywriter"] },
  { name: "Video Editor" },
  { name: "Motion Graphics Designer", aliases: ["animator"] },

  // ── Marketing, sales, business ──
  { name: "Digital Marketing Specialist", aliases: ["digital marketer"] },
  { name: "Digital Marketing Manager" },
  { name: "SEO Specialist", aliases: ["seo analyst"] },
  { name: "Social Media Manager" },
  { name: "Marketing Manager" },
  { name: "Content Marketing Manager" },
  { name: "Sales Executive", aliases: ["sales representative"] },
  { name: "Business Development Executive", aliases: ["bde", "bdm"] },
  { name: "Account Manager" },
  { name: "Customer Success Manager", aliases: ["csm"] },
  { name: "Customer Support Executive", aliases: ["customer service"] },
  { name: "Operations Manager" },
  { name: "Operations Executive" },
  { name: "Supply Chain Analyst", aliases: ["logistics"] },
  { name: "Management Consultant", aliases: ["consulting"] },
  { name: "Entrepreneur", aliases: ["founder"] },

  // ── Finance, HR, legal, admin ──
  { name: "Financial Analyst" },
  { name: "Accountant", aliases: ["accounts executive"] },
  { name: "Chartered Accountant", aliases: ["ca"] },
  { name: "Investment Banker", aliases: ["banking"] },
  { name: "Auditor" },
  { name: "HR Executive", aliases: ["human resources"] },
  { name: "HR Manager" },
  { name: "Recruiter", aliases: ["talent acquisition"] },
  { name: "Administrative Assistant", aliases: ["office admin"] },
  { name: "Executive Assistant" },
  { name: "Legal Associate", aliases: ["lawyer", "advocate"] },

  // ── Engineering (non-software), healthcare, education ──
  { name: "Mechanical Engineer" },
  { name: "Civil Engineer" },
  { name: "Electrical Engineer" },
  { name: "Electronics Engineer", aliases: ["ece"] },
  { name: "Chemical Engineer" },
  { name: "Industrial Engineer" },
  { name: "Nurse", aliases: ["nursing"] },
  { name: "Pharmacist" },
  { name: "Teacher", aliases: ["educator"] },
  { name: "Lecturer", aliases: ["professor", "assistant professor"] },
  { name: "Research Assistant" },
  { name: "Fresher", aliases: ["entry level", "graduate trainee"] },
];

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9+#]/g, "");

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter(Boolean);

/** Roles shown before the user has typed anything. */
export const POPULAR_ROLES = ROLES.slice(0, 6).map((role) => role.name);

function score(role: RoleEntry, query: string, queryWords: string[]): number {
  const name = normalize(role.name);

  // "fronten", "front end dev" -> start of the title, spaces ignored.
  if (name.startsWith(query)) return 0;

  const aliasStart = role.aliases?.some((alias) =>
    normalize(alias).startsWith(query),
  );
  if (aliasStart) return 1;

  // "dev front" -> every typed word starts a different word of the title.
  const roleWords = words(role.name);
  if (
    queryWords.every((q) => roleWords.some((word) => word.startsWith(q)))
  ) {
    return 2;
  }

  // Matching in the middle of a word is only trustworthy for longer input:
  // "py" would otherwise find "copywriter" and "sde" would find "nodejsdeveloper".
  if (query.length < 4) return -1;

  if (name.includes(query)) return 3;

  if (role.aliases?.some((alias) => normalize(alias).includes(query))) return 4;

  return -1;
}

/** Best matching role titles for what the user has typed so far. */
export function searchRoles(input: string, limit = 6): string[] {
  const query = normalize(input);
  if (!query) return POPULAR_ROLES.slice(0, limit);

  const queryWords = words(input);

  return ROLES.map((role, index) => ({
    name: role.name,
    index,
    rank: score(role, query, queryWords),
  }))
    .filter((match) => match.rank >= 0)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((match) => match.name);
}
