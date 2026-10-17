import { Briefcase } from "lucide-react";

import { useResumeStore } from "../../../../../../store/resume.store";

import { ProfessionalModernTheme as T } from "../../theme.professional-modern";
import SectionHeader from "../../shared/professional-modern/SectionHeader";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

export default function InternshipPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const internships = resume.internships ?? [];

  if (internships.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader title="Internships" icon={<Briefcase size={16} />} />

      <div className="mt-2 space-y-6">
        {internships.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`font-semibold ${T.fontSize.itemTitle} ${T.colors.heading}`}
                >
                  {item.role}
                </h3>

                <p className={`${T.fontSize.itemSubtitle} ${T.colors.body}`}>
                  {item.company}
                </p>
              </div>

              <p
                className={`whitespace-nowrap ${T.fontSize.date} ${T.colors.muted}`}
              >
                {formatMonthYear(item.startDate)} -{" "}
                {item.currentlyInterning
                  ? "Present"
                  : formatMonthYear(item.endDate) || "Present"}
              </p>
            </div>

            {item.responsibilities?.length > 0 && (
              <ul
                className={`mt-2 list-disc list-outside pl-5 space-y-1 ${T.fontSize.body} ${T.colors.body}`}
              >
                {item.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}

            {item.achievements?.length > 0 && (
              <ul
                className={`mt-2 list-disc list-outside pl-5 space-y-1 ${T.fontSize.body} ${T.colors.body}`}
              >
                {item.achievements.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
