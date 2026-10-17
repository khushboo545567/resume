import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";
import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function SummaryPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const summarySection = resume.sections.find(
    (section) => section.id === "summary",
  );

  if (!resume.summary.trim()) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          summarySection?.displayTitle?.trim() ||
          summarySection?.title ||
          "Summary"
        }
      />

      <p
        className={`
          ${T.spacing.itemHeader ?? "mt-4"}
          whitespace-pre-line
          ${T.lineHeight.body}
          ${T.fontSize.body}
          ${T.colors.body}
          
        `}
      >
        {resume.summary}
      </p>
    </section>
  );
}
