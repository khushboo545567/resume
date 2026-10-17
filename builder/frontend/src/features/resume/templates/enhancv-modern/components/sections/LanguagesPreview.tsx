import { Fragment } from "react";

import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";

import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function LanguagesPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const languages = resume.languages ?? [];

  const languagesSection = resume.sections.find(
    (section) => section.id === "languages",
  );

  if (languages.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          languagesSection?.displayTitle?.trim() ||
          languagesSection?.title ||
          "Languages"
        }
      />

      <div
        className={`
          mt-4
          grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2
        `}
      >
        {languages.map((language, index) => (
          <Fragment key={index}>
            <span
              className={`
                ${T.fontSize.body}
                ${T.colors.heading}
              `}
            >
              {language.name}
            </span>

            <span
              className={`
                ${T.fontSize.date}
                ${T.colors.muted}
              `}
            >
              {language.level}
            </span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
