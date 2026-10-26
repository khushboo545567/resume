import { Bot, Download, FileText, Mail } from "lucide-react";

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
        icon={<FileText size={20} />}
      />

      <StatCard
        title="Cover Letters"
        value={coverLetters}
        icon={<Mail size={20} />}
      />

      <StatCard
        title="AI Interviews"
        value={interviews}
        icon={<Bot size={20} />}
      />

      <StatCard
        title="Downloads"
        value={downloads}
        icon={<Download size={20} />}
      />
    </div>
  );
}
