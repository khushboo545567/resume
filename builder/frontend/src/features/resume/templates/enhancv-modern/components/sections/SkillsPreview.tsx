
import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";
import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function SkillsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const skills = resume.skills ?? [];

  const skillsSection = resume.sections.find(
    (section) => section.id === "skills"
  );

  if (skills.length === 0) return null;

  const allSkills = skills.flatMap((category) => category.skills);

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          skillsSection?.displayTitle?.trim() ||
          skillsSection?.title ||
          "Skills"
        }
        // icon={<Wrench size={16} />}
      />

      <p
        className={`
          ${T.spacing.itemHeader}
          ${T.lineHeight.body}
          ${T.fontSize.body}
          ${T.colors.body}
        `}
      >
        {allSkills.join(", ")}
      </p>
    </section>
  );
}