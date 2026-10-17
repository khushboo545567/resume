import PersonalInfoSection from "../sections/PersonalInfoSection";
import SummarySection from "../sections/SummarySection";
import ExperienceSection from "../sections/ExperienceSection";
import EducationSection from "../sections/EducationSection";
import SkillsSection from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import LanguagesSection from "../sections/LanguagesSection";
import CertificationsSection from "../sections/CertificationsSection";
import AwardsSection from "../sections/AwardsSection";
import InterestsSection from "../sections/InterestsSection";
import TemplatesSection from "../sections/TemplatesSection";
import SettingsSection from "../sections/SettingsSection";
import StrengthsSection from "../sections/StrengthsSection";

import { useResumeStore } from "../../../../store/resume.store";

import CustomSection from "../sections/CustomSection";
import InternshipSection from "../../components/sections/InternshipSection";
import AchievementsSection from "../../components/sections/AchievementsSection";

interface Props {
  activeSection: string;
}

const sectionComponentMap = {
  personalInfo: PersonalInfoSection,

  internships: InternshipSection,

  summary: SummarySection,

  experience: ExperienceSection,

  education: EducationSection,

  skills: SkillsSection,

  projects: ProjectsSection,

  languages: LanguagesSection,

  certifications: CertificationsSection,

  awards: AwardsSection,

  achievements: AchievementsSection,

  interests: InterestsSection,

  strengths: StrengthsSection,

  templates: TemplatesSection,

  settings: SettingsSection,
};

export default function DynamicEditorRenderer({ activeSection }: Props) {
  const resume = useResumeStore((state) => state.resume);

  const Component =
    sectionComponentMap[activeSection as keyof typeof sectionComponentMap];

  const customSection = resume?.customSections?.find(
    (section) => section.id === activeSection,
  );

  // Custom Section
  if (customSection) {
    return <CustomSection sectionId={activeSection} />;
  }

  // Section not found
  if (!Component) {
    return (
      <div className="py-10 text-center text-nav-text">Section not found</div>
    );
  }

  return <Component />;
}
