import { useMemo } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CalendarCheck2,
  FileText,
  FileUp,
  Mail,
  PenLine,
  Plus,
  ScanSearch,
  Sparkles,
  Download,
  LayoutTemplate,
} from "lucide-react";
import type { ReactNode } from "react";

import { templates } from "../features/resume/config/templates";
import { useResumes } from "../features/resume/hooks/useResumes";
import type { QuickActions } from "../features/dashboard/hooks/useQuickActions";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin } from "../config/auth.config";

/* ---------- data ---------- */

const STEPS = [
  {
    title: "Pick a template",
    text: "Choose an ATS-friendly layout that fits your level and domain.",
  },
  {
    title: "Fill it with AI help",
    text: "Add your details, or let AI draft your summary, projects and skills.",
  },
  {
    title: "Download and apply",
    text: "Check your ATS score, export a PDF, and send it out.",
  },
];

const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <Sparkles size={20} />,
    title: "AI writing help",
    text: "Generate and rewrite your summary, experience, projects and skills.",
  },
  {
    icon: <ScanSearch size={20} />,
    title: "ATS score check",
    text: "See how an applicant tracking system reads your resume and what to fix.",
  },
  {
    icon: <LayoutTemplate size={20} />,
    title: `${templates.length} ATS-friendly templates`,
    text: "Filter by experience level and domain to find the right layout.",
  },
  {
    icon: <Mail size={20} />,
    title: "Cover letters",
    text: "Build a matching cover letter from the same set of templates.",
  },
  {
    icon: <Bot size={20} />,
    title: "AI mock interviews",
    text: "Practice with questions built from your resume and target role.",
  },
  {
    icon: <Download size={20} />,
    title: "PDF export and sharing",
    text: "Download a clean PDF or share a public link to your resume.",
  },
];

/* ---------- small pieces ---------- */

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-display sm:text-3xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-2 max-w-xl text-sm text-subheading sm:text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ContinueStrip() {
  const navigate = useNavigate();
  const { resumes, loading } = useResumes();

  const latest = useMemo(() => {
    if (resumes.length === 0) return null;
    return [...resumes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  }, [resumes]);

  if (loading || !latest) return null;

  return (
    <div className="mx-auto mb-10 flex max-w-3xl flex-col items-start gap-3 rounded-2xl border border-border-popup bg-popup p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
          <FileText size={20} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Continue where you left off
          </p>
          <p className="truncate text-sm font-semibold text-heading">
            {latest.title || "Untitled resume"}
          </p>
          <p className="text-xs text-nav-text">
            Edited {new Date(latest.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/resume/${latest._id}/edit`)}
        className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-btn px-4 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
      >
        <PenLine size={16} />
        Edit resume
      </button>
    </div>
  );
}

/* ---------- page ---------- */

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const {
    handleCreateResume,
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
  } = useOutletContext<QuickActions>();

  const firstName = user?.fullName?.split(" ")[0];

  const previewTemplates = useMemo(() => {
    const featured = templates.filter((t) => t.featured);
    return [...featured, ...templates.filter((t) => !t.featured)].slice(0, 4);
  }, []);

  const goToInterview = (path: string) => {
    if (isAuthLoading) return;

    if (!user) {
      redirectToLogin();
      return;
    }

    navigate(path);
  };

  const quickActions = [
    {
      icon: <Plus size={22} />,
      title: "Create resume",
      text: "Start from a template and build step by step.",
      onClick: handleCreateResume,
    },
    {
      icon: <FileUp size={22} />,
      title: "Upload and improve",
      text: "Upload an existing resume and keep editing it here.",
      onClick: handleOpenUploadResume,
    },
    {
      icon: <ScanSearch size={22} />,
      title: "Check ATS score",
      text: "Find out how well your resume passes an ATS scan.",
      onClick: handleCheckATSScore,
      disabled: isCreatingAtsResume,
    },
    {
      icon: <Mail size={22} />,
      title: "Write cover letter",
      text: "Pick a template and write a matching cover letter.",
      onClick: () => navigate("/cover-letters"),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-16 pb-8 sm:space-y-20">
      {/* 1. Hero */}
      <section className="pt-4 text-center sm:pt-10">
        {user && <ContinueStrip />}

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-display sm:text-5xl">
          {firstName ? (
            <>
              Welcome back, <span className="text-accent">{firstName}</span>
            </>
          ) : (
            <>
              Build Your Resume with{" "}
              <span className="text-accent">ResumeAI</span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm text-subheading sm:text-base">
          Create an ATS-friendly resume with AI, check your score, and practice
          for the interview, all in one place.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCreateResume}
            className="flex h-12 items-center gap-2 rounded-xl bg-btn px-6 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
          >
            <Plus size={18} />
            Create Resume
          </button>

          <button
            type="button"
            onClick={handleCheckATSScore}
            disabled={isCreatingAtsResume}
            className="flex h-12 items-center gap-2 rounded-xl border border-border bg-navbar px-6 text-sm font-semibold text-heading transition hover:bg-btn-hover-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ScanSearch size={18} />
            {isCreatingAtsResume ? "Preparing..." : "Check ATS Score"}
          </button>
        </div>
      </section>

      {/* 2. Quick actions */}
      <section>
        <SectionHeading
          title="What would you like to do?"
          subtitle="Jump straight into the part of the job hunt you need."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className="rounded-2xl border border-border-popup bg-popup p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
                {action.icon}
              </div>
              <h3 className="font-semibold text-heading">{action.title}</h3>
              <p className="mt-1 text-sm text-nav-text">{action.text}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. How it works */}
      <section>
        <SectionHeading
          title="How it works"
          subtitle="From blank page to submitted application in three steps."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-border-popup bg-navbar p-5"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-sidebar text-sm font-bold text-sidebar-text">
                {index + 1}
              </div>
              <h3 className="font-semibold text-heading">{step.title}</h3>
              <p className="mt-1 text-sm text-nav-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Features */}
      <section>
        <SectionHeading
          title="Everything you need to get hired"
          subtitle="One place for your resume, cover letter and interview practice."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border-popup bg-popup p-5 shadow-sm"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-btn-hover-bg text-subheading">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-heading">{feature.title}</h3>
              <p className="mt-1 text-sm text-nav-text">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Interview banner */}
      <section className="overflow-hidden rounded-3xl bg-sidebar p-6 text-sidebar-text sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Interview prep
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Got the resume? Now practice the interview.
            </h2>
            <p className="mt-3 text-sm text-sidebar-text/80 sm:text-base">
              Get mock interview questions based on your resume and target role
              with instant feedback, or book a 1:1 session with a placement
              expert.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => goToInterview("/interview/ai")}
              className="flex h-12 items-center gap-2 rounded-xl bg-navbar px-5 text-sm font-semibold text-heading transition hover:bg-btn-hover-bg"
            >
              <Bot size={18} />
              Try AI interview
            </button>

            <button
              type="button"
              onClick={() => goToInterview("/interview/book")}
              className="flex h-12 items-center gap-2 rounded-xl border border-sidebar-text/30 px-5 text-sm font-semibold text-sidebar-text transition hover:bg-sidebar-hover"
            >
              <CalendarCheck2 size={18} />
              Book a session
            </button>
          </div>
        </div>
      </section>

      {/* 6. Templates teaser */}
      <section>
        <SectionHeading
          title="Templates built to pass ATS"
          subtitle="A small preview. Browse the full collection with filters on the Templates page."
        />

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {previewTemplates.map((template) => (
            <Link
              key={template.slug}
              to="/templates"
              className="rounded-xl border border-border-popup bg-navbar p-2 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-lg bg-navbar-hover shadow-md">
                <img
                  src={template.image}
                  alt={template.name}
                  className="block h-auto w-full"
                />
              </div>
              <p className="mt-2 truncate text-sm font-semibold text-heading">
                {template.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-heading underline-offset-4 hover:underline"
          >
            Browse all templates
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="rounded-3xl border border-border-popup bg-popup px-6 py-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-display sm:text-3xl">
          Ready to land more interviews?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-subheading">
          Create your resume in minutes and check it against ATS before you
          apply.
        </p>
        <button
          type="button"
          onClick={handleCreateResume}
          className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-btn px-7 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
        >
          <Plus size={18} />
          Create your resume
        </button>
      </section>
    </div>
  );
}
