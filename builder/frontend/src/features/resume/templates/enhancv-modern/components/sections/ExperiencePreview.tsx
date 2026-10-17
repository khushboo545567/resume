import { useResumeStore } from "../../../../../../store/resume.store";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

import SectionHeader from "../shared/SectionHeader";
import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function ExperiencePreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const experiences = resume.experience ?? [];

  const experienceSection = resume.sections.find(
    (section) => section.id === "experience",
  );

  if (!experiences.length) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          experienceSection?.displayTitle?.trim() ||
          experienceSection?.title ||
          "Experience"
        }
      />

      <div className={`${T.spacing.itemHeader} space-y-4`}>
        {experiences.map((exp, index) => (
          <div key={index} className={index !== 0 ? T.spacing.item : ""}>
            {/* Row 1 */}
            <div className="flex justify-between items-start">
              {/* Left */}
              <div>
                <h3
                  className={`
                    ${T.fontSize.itemTitle}
                    ${T.fontWeight.heading}
                    ${T.colors.heading}
                    ${T.lineHeight.title}
                  `}
                >
                  {exp.company}
                </h3>

                <p
                  className={`
                    mt-1
                    ${T.fontSize.itemSubtitle}
                    ${T.colors.muted}
                    ${T.lineHeight.title}
                  `}
                >
                  {exp.position}
                </p>
              </div>

              {/* Right */}
              <div className={`text-right ${T.lineHeight.body}`}>
                {exp.location && (
                  <p className={`${T.fontSize.date} ${T.colors.muted}`}>
                    {exp.location}
                  </p>
                )}

                <p className={`${T.fontSize.date} ${T.colors.muted}`}>
                  {formatMonthYear(exp.startDate)} -{" "}
                  {exp.currentlyWorking
                    ? "Present"
                    : formatMonthYear(exp.endDate)}
                </p>
              </div>
            </div>

            {/* Responsibilities */}
            {exp.responsibilities.length > 0 && (
              <ul
                className={`
                  ${T.spacing.itemHeader}
                  ${T.spacing.bullet}
                  ml-5
                  list-disc
                  ${T.fontSize.body}
                  ${T.colors.body}
                  ${T.lineHeight.body}
                `}
              >
                {exp.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {/* Achievements */}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul
                className={`
                  ${T.spacing.itemHeader}
                  ${T.spacing.bullet}
                  ml-5
                  list-disc
                  ${T.fontSize.body}
                  ${T.colors.body}
                  ${T.lineHeight.body}
                `}
              >
                {exp.achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
