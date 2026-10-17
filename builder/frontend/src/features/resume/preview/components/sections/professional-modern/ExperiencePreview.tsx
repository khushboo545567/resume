import { useResumeStore } from "../../../../../../store/resume.store";

import { Briefcase } from "lucide-react";

import { ProfessionalModernTheme as T } from "../../theme.professional-modern";
import SectionHeader from "../../shared/professional-modern/SectionHeader";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

export default function ExperiencePreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const experiences = resume.experience ?? [];
  const experienceSection = resume.sections.find(
    (section) => section.id === "experience",
  );

  if (experiences.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          experienceSection?.displayTitle?.trim() ||
          experienceSection?.title ||
          "Experience"
        }
        icon={<Briefcase size={16} />}
      />

      <div className="mt-2 space-y-6">
        {experiences.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`font-semibold ${T.fontSize.itemTitle} ${T.colors.heading}`}
                >
                  {item.position}
                </h3>

                <p className={`${T.fontSize.itemSubtitle} ${T.colors.body}`}>
                  {item.company}
                  {item.location ? ` • ${item.location}` : ""}
                </p>
              </div>

              <p
                className={`whitespace-nowrap ${T.fontSize.date} ${T.colors.muted}`}
              >
                {formatMonthYear(item.startDate)} -{" "}
                {item.currentlyWorking
                  ? "Present"
                  : formatMonthYear(item.endDate)}
              </p>
            </div>

            {/* Responsibilities */}
            {item.responsibilities.length > 0 && (
              <ul
                className={`mt-2 list-disc list-outside pl-5 space-y-1 ${T.fontSize.body} ${T.colors.body}`}
              >
                {item.responsibilities.map((responsibility, i) => (
                  <li key={i}>{responsibility}</li>
                ))}
              </ul>
            )}

            {/* Achievements */}
            {item.achievements && item.achievements.length > 0 && (
              <div className="mt-3">
                <p
                  className={`font-semibold ${T.fontSize.body} ${T.colors.heading}`}
                >
                  Achievements
                </p>

                <ul
                  className={`mt-1 list-disc list-outside pl-5 space-y-1 ${T.fontSize.body} ${T.colors.body}`}
                >
                  {item.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
