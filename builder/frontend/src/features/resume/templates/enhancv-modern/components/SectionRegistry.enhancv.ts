import SummaryPreview from "./sections/SummaryPreview";
import SkillsPreview from "./sections/SkillsPreview";
import ExperiencePreview from "./sections/ExperiencePreview";
import EducationPreview from "./sections/EducationPreview";
import ProjectsPreview from "./sections/ProjectsPreview";
import CertificationsPreview from "./sections/CertificationsPreview";
import AwardsPreview from "./sections/AwardsPreview";
import LanguagesPreview from "./sections/LanguagesPreview";
import InterestsPreview from "./sections/InterestsPreview";
import StrengthsPreview from "./sections/StrengthsPreview";
import InternshipPreview from "./sections/InternshipPreview";
import AchievementsPreview from "./sections/AchievementsPreview";

export const EnhancvSectionRegistry = {
  summary: SummaryPreview,

  skills: SkillsPreview,

  experience: ExperiencePreview,

  education: EducationPreview,

  projects: ProjectsPreview,

  certifications: CertificationsPreview,
  internships: InternshipPreview,
  awards: AwardsPreview,

  languages: LanguagesPreview,
  strengths: StrengthsPreview,

  interests: InterestsPreview,

  achievements: AchievementsPreview,
} as const;
