// RecentActivity.tsx
import { Sparkles, FileText, ScanSearch, Download, Share2 } from "lucide-react";

const activities = [
  {
    title: "AI generated a professional summary",
    time: "2 min ago",
    icon: Sparkles,
  },
  {
    title: "Resume updated",
    time: "15 min ago",
    icon: FileText,
  },
  {
    title: "ATS Analysis completed",
    time: "1 hour ago",
    icon: ScanSearch,
  },
  {
    title: "Resume downloaded",
    time: "Yesterday",
    icon: Download,
  },
  {
    title: "Resume shared",
    time: "2 days ago",
    icon: Share2,
  },
];

export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-border-popup bg-navbar p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-heading">Recent Activity</h2>

      <div className="space-y-5">
        {activities.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-center gap-4">
              <div className="rounded-xl bg-btn-hover-bg p-3">
                <Icon size={20} className="text-subheading" />
              </div>

              <div className="flex-1">
                <p className="font-medium text-heading">{item.title}</p>

                <p className="text-sm text-nav-text">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
