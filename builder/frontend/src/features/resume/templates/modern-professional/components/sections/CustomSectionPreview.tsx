import { useResumeStore } from "../../../../../../store/resume.store";

import SectionHeader from "../shared/SectionHeader";
import { formatMonthYear } from "../../../../editor/utils/formatDate";

interface Props {
  sectionId: string;
}

export default function CustomSectionPreview({ sectionId }: Props) {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const section = resume.customSections.find((item) => item.id === sectionId);

  if (!section || !section.items.length) return null;

  return (
    <section className="mt-3">
      <SectionHeader title={section.title} />

      <div className="mt-3 space-y-6">
        {section.items.map((item) => (
          <div
            key={item.id}
            className="border-b border-slate-200 pb-5 last:border-b-0"
          >
            <div className="flex justify-between items-start gap-5">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900">
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p className="mt-0.5 text-[12px] font-medium text-blue-700">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {(item.startDate || item.endDate) && (
                <p className="text-[11.5px] font-semibold text-slate-700">
                  {formatMonthYear(item.startDate)}
                  {item.startDate && item.endDate ? " – " : ""}
                  {formatMonthYear(item.endDate)}
                </p>
              )}
            </div>

            {item.description && (
              <p className="mt-3 text-[12.5px] leading-[1.6] text-slate-700 whitespace-pre-line">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
