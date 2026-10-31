import { useCredits } from "../hooks/useCredits";
import type { CreditBalances } from "../services/payment.service";

const GROUPS: {
  label: string;
  items: { key: keyof CreditBalances; label: string }[];
}[] = [
  {
    label: "Resume AI",
    items: [
      { key: "resumeRuns", label: "runs" },
      { key: "resumeEdits", label: "edits" },
    ],
  },
  {
    label: "Cover letter AI",
    items: [
      { key: "coverRuns", label: "runs" },
      { key: "coverEdits", label: "edits" },
    ],
  },
  {
    label: "AI interview",
    items: [
      { key: "interview5", label: "× 5 questions" },
      { key: "interview10", label: "× 10 questions" },
      { key: "interview15", label: "× 15 questions" },
    ],
  },
  {
    label: "ATS & uploads",
    items: [
      { key: "atsChecks", label: "ATS checks" },
      { key: "resumeUploads", label: "free PDF uploads" },
    ],
  },
];

/** "Your credits" panel: what the user can still use. Hidden until loaded. */
export default function CreditsSummary() {
  const { data } = useCredits();

  if (!data) return null;

  return (
    <section
      aria-label="Your AI credits"
      className="mt-6 rounded-2xl border border-border-popup bg-navbar p-5 sm:p-6"
    >
      <h2 className="text-base font-bold text-heading">Your credits</h2>

      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-sm font-semibold text-heading">{group.label}</p>

            <ul className="mt-1.5 space-y-1">
              {group.items.map((item) => (
                <li
                  key={item.key}
                  className="flex items-baseline gap-1.5 text-sm text-subheading"
                >
                  <span className="text-lg font-bold text-display">
                    {data[item.key]}
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-subheading">
        Credits never expire. Each AI action uses one credit. When your free PDF
        uploads run out, an upload uses 1 AI resume edit.
      </p>
    </section>
  );
}
