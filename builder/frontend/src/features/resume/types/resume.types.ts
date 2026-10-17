export const ResumeTemplates = {
  TECHNICAL_DEVELOPER: "technical-developer",
  TECHNICAL_CLASSIC: "technical-classic",
  MODERN_PROFESSIONAL: "modern-professional",
  MINIMAL_CLEAN: "minimal-clean",
  EXECUTIVE: "executive",
  STUDENT: "student",
  ATS: "ats",
  CREATIVE: "creative",
  CLASSIC: "classic",
  CORPORATE: "corporate",
  PROFESSIONAL_MODERN: "professional-modern",
  CORPORATE_BAND: "corporate-band",
  HARVARD_ATS: "harvard-ats",
  SPLIT_LABEL: "split-label",
  CLASSIC_SERIF: "classic-serif",
  CORPORATE_CLASSIC: "corporate-classic", // ADD THIS LINE
  EXECUTIVE_BLUE: "executive-blue",

  // NEW
  ENHANCV_MODERN: "enhancv-modern",
  LATEX_ATS: "latex-ats",
  LATEX_ATS_PHOTO: "latex-ats-photo",
  LATEX_ATS_V2: "latex-ats-v2",
  EXECUTIVE_SIDEBAR: "executive-sidebar",
  LATEX_SIDEBAR: "latex-sidebar",
} as const;

export type ResumeTemplate =
  (typeof ResumeTemplates)[keyof typeof ResumeTemplates];

export interface CreateResumeRequest {
  title: string;
  targetRole: string;
  templateId: ResumeTemplate;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  photo?: string;
  photoZoom?: number;
  photoPosition?: { x: number; y: number };
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string[];
  achievements?: string[];
  location?: string;
  technologies?: string[];
}

// \
// resume.types.ts — education entry
export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startMonth?: string;
  startYear: number;
  endMonth?: string;
  endYear: number;
  current?: boolean;
  cgpa?: string;
  coursework?: string; // comma-separated, e.g. "OOP, DBMS, DSA, Machine Learning"
}

export interface Project {
  title: string;
  role?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description: string[];
  highlight?: string;
  technologies: string[];
  github?: string;

  link?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CustomSection {
  id: string;
  type: "custom";
  title: string;
  enabled: boolean;
  order: number;
  items: CustomSectionItem[];
}
export interface SkillCategory {
  title: string;
  skills: string[];
}
export interface LanguageItem {
  name: string;
  level: string;
}

export interface Internship {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyInterning?: boolean;
  responsibilities: string[];
  achievements: string[];
  location?: string;
}

export interface Resume {
  _id: string;
  title: string;
  version: number;
  status: "draft" | "completed";
  targetRole: string;
  templateId: ResumeTemplate;
  sections: ResumeSection[];
  personalInfo: PersonalInfo;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: string[]; // string[] hi hai
  languages: LanguageItem[];
  awards: string[]; // string[] hi hai
  interests: string[];
  customSections: CustomSection[];
  createdAt: string;
  updatedAt: string;
  internships: Internship[];
  strengths: Strength[];
  achievements: string[];
}
export interface Strength {
  title: string;
  description: string;
}

export interface ResumeSection {
  id: string;

  type:
    | "personalInfo"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "languages"
    | "certifications"
    | "awards"
    | "interests"
    | "custom"
    | "internships"
    | "strengths"
    | "achievements";

  title: string;

  enabled: boolean;

  order: number;
  displayTitle?: string;
}
