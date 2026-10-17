// type SectionType = Exclude<
//   ResumeSection["type"],
//   "personalInfo"

import SummaryPreview from "./sections/SummaryPreview";
import SkillsPreview from "./sections/SkillsPreview";
import ExperiencePreview from "./sections/ExperiencePreview";
import EducationPreview from "./sections/EducationPreview";
import ProjectsPreview from "./sections/ProjectsPreview";
import InternshipPreview from "./sections/InternshipPreview";
import CertificationsPreview from "./sections/CertificationsPreview";
import AwardsPreview from "./sections/AwardsPreview";
import StrengthsPreview from "./sections/StrengthsPreview";
import LanguagesPreview from "./sections/LanguagesPreview";
import InterestsPreview from "./sections/InterestsPreview";
import AchievementsPreview from "./sections/AchievementsPreview";

import type { ResumeSection } from "../../../types/resume.types";

type SectionType = Exclude<ResumeSection["type"], "personalInfo" | "custom">;

type SectionComponent = () => React.ReactElement | null;

export const sectionComponentMap: Record<SectionType, SectionComponent> = {
  summary: SummaryPreview,
  skills: SkillsPreview,
  experience: ExperiencePreview,
  education: EducationPreview,
  projects: ProjectsPreview,
  internships: InternshipPreview,
  certifications: CertificationsPreview,
  awards: AwardsPreview,
  achievements: AchievementsPreview,
  strengths: StrengthsPreview,
  languages: LanguagesPreview,
  interests: InterestsPreview,
};
