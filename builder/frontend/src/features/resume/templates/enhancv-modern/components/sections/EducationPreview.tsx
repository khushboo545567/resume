import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";
import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function EducationPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const education = resume.education ?? [];

  const educationSection = resume.sections.find(
    (section) => section.id === "education",
  );

  if (!education.length) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          educationSection?.displayTitle?.trim() ||
          educationSection?.title ||
          "Education"
        }
      />
      <div className={`${T.spacing.itemHeader} space-y-4`}>
        {education.map((edu, index) => (
          <div key={index} className={index !== 0 ? T.spacing.item : ""}>
            {/* Row 1 */}
            <div className="flex justify-between items-center">
              <h3
                className={`
                  ${T.fontSize.itemTitle}
                  ${T.fontWeight.heading}
                  ${T.colors.heading}
                  ${T.lineHeight.title}
                `}
              >
                {edu.institution}
              </h3>

              <span
                className={`
                  ${T.fontSize.date}
                  ${T.colors.muted}
                `}
              >
                {edu.location}
              </span>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between items-start mt-1">
              <p
                className={`
                  ${T.fontSize.itemSubtitle}
                  ${T.colors.body}
                  ${T.lineHeight.title}
                `}
              >
                {edu.degree}
                {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}
              </p>

              <span
                className={`
                  ${T.fontSize.date}
                  ${T.colors.muted}
                `}
              >
                {edu.startYear} - {edu.current ? "Present" : edu.endYear}
              </span>
            </div>

            {edu.cgpa && (
              <p
                className={`
                  mt-1
                  ${T.fontSize.body}
                  ${T.colors.muted}
                  ${T.lineHeight.body}
                `}
              >
                CGPA: {edu.cgpa}
              </p>
            )}

            {edu.coursework && (
              <p
                className={`
                  mt-1
                  ${T.fontSize.body}
                  ${T.colors.body}
                  ${T.lineHeight.body}
                `}
              >
                {edu.coursework}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
