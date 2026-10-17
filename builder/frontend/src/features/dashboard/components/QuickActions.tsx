// QuickActions.tsx
import { FilePlus2, Sparkles, ScanSearch, Upload } from "lucide-react";

interface Props {
  onCreate: () => void;
  onAnalyseATS: () => void;
}

const actions = [
  {
    title: "Create Resume",
    description: "Start a new resume",
    icon: FilePlus2,
  },
  {
    title: "AI Summary",
    description: "Generate ATS summary",
    icon: Sparkles,
  },
  {
    title: "ATS Check",
    description: "Analyze resume score",
    icon: ScanSearch,
  },
  {
    title: "Import Resume",
    description: "Upload existing resume",
    icon: Upload,
  },
];

export default function QuickActions({ onCreate, onAnalyseATS }: Props) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold text-heading sm:mb-5 sm:text-2xl">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              onClick={() => {
                if (item.title === "Create Resume") {
                  onCreate();
                }

                if (
                  item.title === "ATS Check" ||
                  item.title === "Import Resume"
                ) {
                  onAnalyseATS();
                }
              }}
              className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 rounded-2xl border border-border-popup bg-navbar p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg min-[420px]:block sm:p-6"
            >
              <div className="row-span-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-btn-hover-bg min-[420px]:mb-3 sm:mb-4 sm:h-12 sm:w-12">
                <Icon size={20} className="text-subheading" />
              </div>

              <h3 className="truncate text-sm font-semibold text-heading sm:text-base">
                {item.title}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs text-nav-text sm:mt-2 sm:text-sm">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
