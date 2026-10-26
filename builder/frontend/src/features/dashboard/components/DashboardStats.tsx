import StatCard from "./StatCard";

interface Props {
  resumes: number;
  draft: number;
  completed: number;
  coverLetters: number | string;
  interviews: number | string;
  downloads: number;
}

export default function DashboardStats({
  resumes,
  draft,
  completed,
  coverLetters,
  interviews,
  downloads,
}: Props) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      <StatCard
        title="Resumes"
        value={resumes}
        subtitle={`${draft} draft · ${completed} completed`}
      />

      <StatCard
        title="Cover Letters"
        value={coverLetters}
      />

      <StatCard
        title="AI Interviews"
        value={interviews}
      />

      <StatCard
        title="Downloads"
        value={downloads}
      />
    </div>
  );
}
