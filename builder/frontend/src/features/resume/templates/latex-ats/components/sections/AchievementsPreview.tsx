import { useResumeStore } from "../../../../../../store/resume.store";

import { LatexATSTheme as T } from "../theme.latex-ats";
import SectionHeader from "../shared/SectionHeader";

export default function AchievementsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume || !resume.achievements?.length) {
    return null;
  }

  return (
    <section className={T.spacing.section}>
      <SectionHeader title="Achievements" />

      <ul
        className={`
          ${T.list.bullet}
          ${T.spacing.itemHeader}
          ${T.spacing.bullet}
          ${T.fontSize.body}
          ${T.lineHeight.body}
          ${T.colors.body}
        `}
      >
        {resume.achievements.map((achievement, index) => {
          const text = achievement?.trim();

          if (!text) return null;

          return <li key={`${index}-${text}`}>{text}</li>;
        })}
      </ul>
    </section>
  );
}
