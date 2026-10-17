import { useResumeStore } from "../../../../../../store/resume.store";
import { FaTrophy } from "react-icons/fa6";

import { ModernProfessionalTheme as T } from "../theme.modern-professional";
import SectionHeader from "../shared/SectionHeader";

export default function AchievementsPreview() {
  const resume = useResumeStore((state) => state.resume);

  if (!resume) return null;

  const achievements = resume.achievements ?? [];

  const visibleAchievements = achievements.filter(
    (achievement) => achievement && achievement.trim().length > 0,
  );

  if (visibleAchievements.length === 0) {
    return null;
  }

  return (
    <section className={T.spacing.section}>
      <SectionHeader
        title="Achievements"
        icon={<FaTrophy size={T.sectionHeader.badgeIconSize} />}
      />

      <ul className="mt-2 list-disc space-y-2 pl-4 text-[12.5px] leading-[1.6] text-slate-700">
        {visibleAchievements.map((achievement, index) => (
          <li key={`${index}-${achievement}`}>{achievement}</li>
        ))}
      </ul>
    </section>
  );
}
