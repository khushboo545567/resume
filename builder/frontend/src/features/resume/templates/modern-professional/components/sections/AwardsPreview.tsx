import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";

export default function AwardsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume || resume.awards.length === 0) return null;

  return (
    <section className="mt-3">
      <SectionHeader title="Awards" />

      <ul className="mt-3 list-disc space-y-2 pl-4 text-[12.5px] leading-[1.6] text-slate-700">
        {resume.awards.map((award, index) => (
          <li key={index}>{award}</li>
        ))}
      </ul>
    </section>
  );
}
