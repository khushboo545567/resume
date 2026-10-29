import { useMemo } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  FileUp,
  FolderOpen,
  LayoutTemplate,
  Mail,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { templates } from "../features/resume/config/templates";
import type { QuickActions } from "../features/dashboard/hooks/useQuickActions";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin } from "../config/auth.config";

/* ---------- data ---------- */

const HERO_POINTS = [
  "ATS-friendly templates",
  "AI writing help",
  "Download as PDF",
];

const BENEFITS: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <LayoutTemplate size={26} />,
    title: "ATS-friendly templates",
    text: `Pick from ${templates.length} layouts built to be read cleanly by applicant tracking systems.`,
  },
  {
    icon: <Sparkles size={26} />,
    title: "AI writing help",
    text: "Let AI draft your summary, experience and projects, then edit it in your own words.",
  },
  {
    icon: <FolderOpen size={26} />,
    title: "All resumes in one place",
    text: "Keep every version in My Resumes and duplicate one for your next application.",
  },
  {
    icon: <ScanSearch size={26} />,
    title: "Know your ATS score",
    text: "See how an ATS reads your resume and get suggestions on what to fix.",
  },
];

const STEPS = [
  {
    title: "Pick a template",
    text: "Browse ATS-friendly layouts by experience level and domain, and choose the one that fits you.",
  },
  {
    title: "Fill in your details",
    text: "Add your information section by section, or let AI write a first draft that you can edit.",
  },
  {
    title: "Download and apply",
    text: "Check your ATS score, export a PDF, and start applying.",
  },
];

const ATS_POINTS = [
  "Keyword match against a job description",
  "Score broken down by resume section",
  "Date and consistency checks",
  "Specific suggestions for each section",
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
    <div className="mb-6 text-left sm:mb-8">
      <h2 className="text-2xl font-bold leading-tight text-display sm:text-3xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 max-w-xl text-sm leading-6 text-subheading sm:text-base sm:leading-7">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const {
    handleChooseTemplate,
    handleCreateResumeWithAI,
    handleCheckATSScore,
    handleOpenUploadResume,
    isCreatingAtsResume,
  } = useOutletContext<QuickActions>();

  const firstName = user?.fullName?.split(" ")[0];

  // Real template previews from the app, used as the hero visual.
  const heroTemplates = useMemo(() => {
    const featured = templates.find((t) => t.featured);
    const list = featured ? [featured, ...templates] : templates;

    return list
      .filter((t, index) => list.findIndex((x) => x.slug === t.slug) === index)
      .slice(0, 3);
  }, []);

  const showcaseTemplates = useMemo(() => {
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

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 pb-8 sm:space-y-16 lg:space-y-24">
      {/* 1. Hero */}
      <section className="grid items-center gap-8 pt-2 sm:gap-10 sm:pt-8 lg:grid-cols-2 lg:gap-14">
        <div className="text-center lg:text-left">
          {firstName && (
            <p className="mb-3 inline-block rounded-full bg-btn-hover-bg px-3 py-1 text-sm font-medium text-subheading">
              Welcome back, {firstName}
            </p>
          )}

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-display sm:text-5xl lg:text-6xl">
            Build an ATS-friendly resume with{" "}
            <span className="text-accent">AI</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-subheading sm:mt-5 sm:text-lg lg:mx-0">
            Choose a template, fill it in with AI help, check your ATS score and
            download it as a PDF. Then practice for the interview, all in one
            place.
          </p>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:justify-start">
            <button
              type="button"
              onClick={handleCreateResumeWithAI}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-btn px-5 text-base font-semibold text-btn-text transition hover:bg-btn-hover sm:px-7"
            >
              <Sparkles size={18} />
              Create Resume with AI
            </button>

            <button
              type="button"
              onClick={handleChooseTemplate}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border-strong bg-transparent px-5 text-base font-semibold text-heading transition hover:bg-btn-hover-bg sm:px-7"
            >
              Choose a template
            </button>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3 lg:justify-start">
            {HERO_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-center gap-1.5 text-sm text-subheading"
              >
                <Check size={16} className="shrink-0 text-green-700" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-subheading lg:justify-start">
            <button
              type="button"
              onClick={handleCheckATSScore}
              disabled={isCreatingAtsResume}
              className="flex items-center gap-1.5 underline-offset-4 transition hover:text-heading hover:underline disabled:opacity-50"
            >
              <ScanSearch size={15} />
              {isCreatingAtsResume ? "Preparing..." : "Check ATS score"}
            </button>

            <button
              type="button"
              onClick={handleOpenUploadResume}
              className="flex items-center gap-1.5 underline-offset-4 transition hover:text-heading hover:underline"
            >
              <FileUp size={15} />
              Upload a resume
            </button>

            <Link
              to="/cover-letters"
              className="flex items-center gap-1.5 underline-offset-4 transition hover:text-heading hover:underline"
            >
              <Mail size={15} />
              Write a cover letter
            </Link>
          </div>
        </div>

        {/* Visual: real template previews */}
        <div
          className="relative mx-auto hidden h-[420px] w-full max-w-[460px] sm:block"
          aria-hidden="true"
        >
          <div className="absolute inset-x-4 inset-y-6 rounded-[3rem] bg-btn-hover-bg" />

          {heroTemplates[1] && (
            <img
              src={heroTemplates[1].image}
              alt=""
              className="absolute left-0 top-10 w-[46%] -rotate-6 rounded-lg border border-border-popup bg-popup shadow-xl"
            />
          )}

          {heroTemplates[2] && (
            <img
              src={heroTemplates[2].image}
              alt=""
              className="absolute right-0 top-8 w-[46%] rotate-6 rounded-lg border border-border-popup bg-popup shadow-xl"
            />
          )}

          {heroTemplates[0] && (
            <img
              src={heroTemplates[0].image}
              alt=""
              className="absolute left-1/2 top-0 z-10 w-[52%] -translate-x-1/2 rounded-lg border border-border-popup bg-popup shadow-2xl"
            />
          )}
        </div>
      </section>

      {/* 2. Why use ResumeAI */}
      <section className="rounded-3xl bg-section-panel px-5 py-8 sm:px-10 sm:py-12 lg:py-14">
        <SectionHeading title="Why use ResumeAI for your next resume?" />

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 text-left"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-btn-hover-bg text-subheading sm:h-12 sm:w-12 [&>svg]:h-5 [&>svg]:w-5">
                {benefit.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-6 text-heading sm:text-lg">
                  {benefit.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-nav-text">
                  {benefit.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How it works */}
      <section className="rounded-3xl bg-section-panel px-5 py-8 sm:px-10 sm:py-12 lg:py-14">
        <SectionHeading
          title="How does ResumeAI work?"
          subtitle="Three simple steps from a blank page to a resume you can send."
        />

        <div className="grid gap-7 sm:gap-8 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-start gap-4 text-left">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar text-base font-bold text-sidebar-text sm:h-12 sm:w-12 sm:text-lg">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold leading-6 text-heading sm:text-lg">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-nav-text sm:text-base sm:leading-7">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handleCreateResumeWithAI}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 text-base font-semibold text-btn-text transition hover:bg-btn-hover sm:mx-auto sm:w-fit sm:px-7"
          >
            <Sparkles size={18} />
            Create Resume with AI
          </button>
        </div>
      </section>

      {/* 4. Templates showcase */}
      <section>
        <SectionHeading
          title="Templates built for ATS"
          subtitle="A few of our layouts. Filter the full collection by level and domain."
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-x-5">
          {showcaseTemplates.map((template) => (
            <Link
              key={template.slug}
              to="/templates"
              className="group block min-w-0"
            >
              <div className="overflow-hidden rounded-xl border border-border-popup bg-popup shadow-sm transition-shadow duration-200 group-hover:shadow-xl">
                <img
                  src={template.image}
                  alt={`${template.name} resume preview`}
                  loading="lazy"
                  className="block aspect-[210/297] w-full object-cover object-top"
                />
              </div>

              <p className="mt-3 truncate text-sm font-semibold text-heading">
                {template.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-heading underline-offset-4 hover:underline"
          >
            Browse all {templates.length} templates
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. ATS check */}
      <section className="grid items-start gap-8 rounded-3xl bg-section-panel px-5 py-8 sm:gap-10 sm:px-10 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-14 lg:py-14">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            ATS check
          </p>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-display sm:text-3xl">
            See your resume the way an ATS does
          </h2>

          <p className="mt-4 text-sm leading-7 text-subheading sm:text-base">
            Many employers use applicant tracking systems to filter resumes
            before a person reads them. Run the checker and fix issues before
            you apply.
          </p>

          <button
            type="button"
            onClick={handleCheckATSScore}
            disabled={isCreatingAtsResume}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-btn px-5 text-base font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit sm:px-7"
          >
            <ScanSearch size={18} />
            {isCreatingAtsResume ? "Preparing..." : "Check ATS Score"}
          </button>
        </div>

        <div className="min-w-0 rounded-2xl bg-transparent sm:border sm:border-border-popup sm:bg-popup sm:p-5 lg:p-6">
          <p className="mb-4 text-sm font-semibold text-heading">
            What the checker looks at
          </p>

          <ul className="space-y-3">
            {ATS_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-xl border border-border bg-navbar px-3 py-3 text-sm leading-6 text-heading sm:px-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-1 shrink-0 text-green-700"
                />

                <span className="min-w-0">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Interview banner */}
      <section className="overflow-hidden rounded-3xl bg-sidebar px-5 py-8 text-sidebar-text sm:px-10 sm:py-12 lg:py-14">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="min-w-0 max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-soft">
              Interview prep
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Got the resume? Now practice the interview.
            </h2>

            <p className="mt-4 text-sm leading-7 text-sidebar-text/80 sm:text-base">
              Get mock interview questions based on your resume and target role,
              with instant feedback on your answers.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:shrink-0 md:flex-col lg:flex-row">
            <button
              type="button"
              onClick={() => goToInterview("/interview/ai")}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navbar px-5 text-sm font-semibold text-heading transition hover:bg-btn-hover-bg sm:flex-1 md:w-auto md:flex-none"
            >
              <Bot size={18} className="shrink-0" />
              Try AI interview
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
