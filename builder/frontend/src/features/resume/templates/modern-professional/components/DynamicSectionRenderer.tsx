import { useResumeStore } from "../../../../../store/resume.store";
import type { ResumeSection } from "../../../types/resume.types";

import { sectionComponentMap } from "./SectionRegistry.modern";
import CustomSectionPreview from "./sections/CustomSectionPreview";

type RenderableSection = ResumeSection & {
  type: Exclude<ResumeSection["type"], "personalInfo">;
};

interface DynamicSectionRendererProps {
  side: "left" | "right";
}

const leftSections: RenderableSection["type"][] = [
  "summary",
  "experience",
  "projects",
  "internships",
  "custom",
];

const rightSections: RenderableSection["type"][] = [
  "skills",
  "education",
  "certifications",
  "languages",
  "awards",
  "achievements",
  "strengths",
  "interests",
];

export default function DynamicSectionRenderer({
  side,
}: DynamicSectionRendererProps) {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const allowedSections = side === "left" ? leftSections : rightSections;

  const visibleSections = resume.sections
    .filter(
      (section): section is RenderableSection =>
        section.enabled &&
        section.type !== "personalInfo" &&
        allowedSections.includes(section.type),
    )
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map((section) => {
        const customSection = resume.customSections.find(
          (item) => item.id === section.id,
        );

        if (customSection) {
          return (
            <CustomSectionPreview key={section.id} sectionId={section.id} />
          );
        }

        const Component =
          sectionComponentMap[section.type as keyof typeof sectionComponentMap];

        if (!Component) {
          console.warn(`No component found for section: ${section.type}`);
          return null;
        }

        return <Component key={section.id} />;
      })}
    </>
  );
}
