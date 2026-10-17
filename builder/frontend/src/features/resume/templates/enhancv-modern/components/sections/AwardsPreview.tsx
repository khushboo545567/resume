import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";

import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function AwardsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const awards = resume.awards ?? [];

  const awardsSection = resume.sections.find(
    (section) => section.id === "awards",
  );

  if (awards.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          awardsSection?.displayTitle?.trim() ||
          awardsSection?.title ||
          "Awards"
        }
      />

      <div className="mt-4 space-y-3">
        {awards.map((award, index) => (
          <div key={index} className="">
            {/* <p
              className={`
                ${T.fontSize.body}
                ${T.colors.body}
              `}
            >
              {award}
            </p> */}

            <p
              className={`
    ${T.fontSize.body}
    ${T.lineHeight.body}
    ${T.colors.body}
  `}
            >
              {award}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
