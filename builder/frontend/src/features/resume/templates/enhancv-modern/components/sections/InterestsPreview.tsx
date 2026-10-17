import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";

import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

export default function InterestsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const interests = resume.interests ?? [];

  const interestsSection = resume.sections.find(
    (section) => section.id === "interests",
  );

  if (interests.length === 0) return null;

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title={
          interestsSection?.displayTitle?.trim() ||
          interestsSection?.title ||
          "Interests"
        }
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {interests.map((interest, index) => (
          <span
            key={index}
            // className="
            //   rounded-full
            //   border
            //   border-slate-300
            //   px-3
            //   py-1
            //   text-sm
            //   bg-slate-100
            //   text-slate-700
            // "

            className={`
  rounded-full
  border
  border-slate-300
  px-3
  py-1
  bg-slate-100
  ${T.fontSize.body}
  ${T.colors.body}
`}
          >
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
}
