import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Check, MicVocal } from "lucide-react";

import DashboardSection from "../features/dashboard/components/DashboardSection";

interface OptionProps {
  icon: ReactNode;
  tag: string;
  title: string;
  description: string;
  points: string[];
  cta: string;
  onClick: () => void;
}

/** One "how do you want to practice" card. */
function OptionCard({
  icon,
  tag,
  title,
  description,
  points,
  cta,
  onClick,
}: OptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border-popup bg-popup text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl"
    >
      <div className="relative overflow-hidden bg-linear-to-br from-navbar to-navbar-hover p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 transition-transform duration-500 group-hover:scale-150" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar to-btn text-gold-soft shadow-lg">
            {icon}
          </div>

          <span className="rounded-full bg-btn-hover-bg px-3 py-1 text-xs font-semibold text-subheading">
            {tag}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-heading">{title}</h3>
        <p className="mt-2 text-sm text-nav-text">{description}</p>

        <ul className="mt-5 space-y-2.5">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-sm text-heading"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-700/10 text-green-700">
                <Check size={12} strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <span className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text shadow-md transition group-hover:bg-btn-hover">
          {cta}
          <ArrowRight
            size={16}
            className="transition group-hover:translate-x-1"
          />
        </span>
      </div>
    </button>
  );
}

export default function InterviewPage() {
  const navigate = useNavigate();

  return (
    <div className="min-w-0 space-y-8 sm:space-y-10">
      {/* Banner (same look as the dashboard hero) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sidebar via-sidebar-hover to-border-sidebar p-6 text-sidebar-text shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-soft">
            <MicVocal size={13} /> Interview prep
          </span>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Walk into your next <span className="text-gold-soft">interview</span>{" "}
            ready
          </h1>

          <p className="mt-2 text-sm text-sidebar-text/75 sm:text-base">
            Practice with AI-generated questions tailored to your resume and
            get instant feedback on every answer.
          </p>
        </div>
      </div>

      {/* Options */}
      <DashboardSection title="Practice with AI">
        <div className="grid min-w-0 gap-4 sm:gap-6 md:max-w-xl">
          <OptionCard
            icon={<Bot size={26} />}
            tag="Instant"
            title="Interview with AI"
            description="Get personalised interview questions and instant feedback based on your resume and target role."
            points={[
              "Questions tailored to your resume",
              "Instant scoring and feedback",
              "Practice any time, as often as you like",
            ]}
            cta="Start AI interview"
            onClick={() => navigate("/interview/ai")}
          />
        </div>
      </DashboardSection>
    </div>
  );
}
