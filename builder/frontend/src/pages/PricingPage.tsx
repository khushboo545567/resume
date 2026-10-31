import { useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, FileText, Mail, MessageSquare, Sparkles } from "lucide-react";

import { useAuthStore } from "../store/auth.store";
import { redirectToLogin } from "../config/auth.config";
import {
  ALL_IN_ONE_PLAN,
  COVER_LETTER_PLANS,
  FREE_FEATURES,
  INTERVIEW_QUESTION_OPTIONS,
  RESUME_PLANS,
  formatPrice,
  getInterviewPlans,
} from "../features/pricing/plans";
import type {
  InterviewQuestions,
  Plan,
  PlanCategory,
} from "../features/pricing/plans";
import { useCheckout } from "../features/pricing/hooks/useCheckout";
import CheckoutStatusModal from "../features/pricing/components/CheckoutStatusModal";
import CreditsSummary from "../features/pricing/components/CreditsSummary";

/* ---------- tabs ---------- */

const TABS: { id: PlanCategory; label: string; icon: ReactNode }[] = [
  { id: "resume", label: "Resume AI", icon: <FileText size={16} /> },
  { id: "cover-letter", label: "Cover letter AI", icon: <Mail size={16} /> },
  { id: "interview", label: "AI interview", icon: <MessageSquare size={16} /> },
  { id: "all-in-one", label: "All-in-one", icon: <Sparkles size={16} /> },
];

const TAB_INTRO: Record<PlanCategory, string> = {
  resume: "Generate a resume with AI and refine it with AI edits.",
  "cover-letter": "Generate a cover letter and rewrite parts of it with AI.",
  interview: "Practice mock interviews built from your resume and target role.",
  "all-in-one": "A smaller amount of each AI feature in one pack.",
};

/* ---------- small pieces ---------- */

const isTab = (value: string | null): value is PlanCategory =>
  TABS.some((item) => item.id === value);

const isQuestionCount = (value: number): value is InterviewQuestions =>
  (INTERVIEW_QUESTION_OPTIONS as readonly number[]).includes(value);

function PlanCard({
  plan,
  onBuy,
  disabled,
}: {
  plan: Plan;
  onBuy: (plan: Plan) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border-popup bg-navbar p-5 sm:p-6">
      <h3 className="text-base font-bold text-heading">{plan.name}</h3>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold text-display">
          {formatPrice(plan.price)}
        </span>
        <span className="text-sm text-subheading">one-time</span>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-heading">
            <Check size={16} className="mt-0.5 shrink-0 text-gold" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onBuy(plan)}
        disabled={disabled}
        className="mt-6 h-11 w-full rounded-xl bg-btn text-sm font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        Buy for {formatPrice(plan.price)}
      </button>
    </div>
  );
}

/* ---------- page ---------- */

export default function PricingPage() {
  const user = useAuthStore((state) => state.user);

  // The "out of credits" prompt links here as /pricing?tab=cover-letter (or
  // tab=interview&questions=15) so the user lands on the pack they need.
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const questionsParam = Number(searchParams.get("questions"));

  const [tab, setTab] = useState<PlanCategory>(
    isTab(tabParam) ? tabParam : "resume",
  );
  const [questions, setQuestions] = useState<InterviewQuestions>(
    isQuestionCount(questionsParam) ? questionsParam : 10,
  );

  const checkout = useCheckout();

  const handleBuy = (plan: Plan) => {
    if (!user) {
      redirectToLogin();
      return;
    }

    void checkout.buy(plan);
  };

  const plans: Plan[] =
    tab === "resume"
      ? RESUME_PLANS
      : tab === "cover-letter"
        ? COVER_LETTER_PLANS
        : tab === "interview"
          ? getInterviewPlans(questions)
          : [ALL_IN_ONE_PLAN];

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* ---------- heading ---------- */}
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold text-display sm:text-3xl">
          Upgrade your AI credits
        </h1>
        <p className="mt-2 text-sm text-subheading sm:text-base">
          Pay once for the AI features you need. No subscription and nothing
          renews on its own.
        </p>
      </header>

      {/* ---------- balance (signed-in users) ---------- */}
      <CreditsSummary />

      {/* ---------- free ---------- */}
      <section className="mt-6 rounded-2xl border border-border-popup bg-navbar p-5 sm:p-6">
        <h2 className="text-base font-bold text-heading">Always free</h2>

        <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          {FREE_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-heading">
              <Check size={16} className="mt-0.5 shrink-0 text-gold" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- paid ---------- */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-display">Paid packs</h2>

        <div
          role="tablist"
          aria-label="Pack type"
          className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
        >
          {TABS.map((item) => {
            const active = item.id === tab;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                  active
                    ? "border-btn bg-btn text-btn-text"
                    : "border-border bg-navbar text-heading hover:bg-btn-hover-bg"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-subheading">{TAB_INTRO[tab]}</p>

        {tab === "interview" && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-heading">
              Questions per session
            </p>

            <div className="mt-2 inline-flex rounded-xl border border-border bg-navbar p-1">
              {INTERVIEW_QUESTION_OPTIONS.map((count) => {
                const active = count === questions;

                return (
                  <button
                    key={count}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setQuestions(count)}
                    className={`h-9 min-w-14 rounded-lg px-4 text-sm font-semibold transition ${
                      active
                        ? "bg-btn text-btn-text"
                        : "text-heading hover:bg-btn-hover-bg"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`mt-5 grid gap-4 ${
            plans.length === 1 ? "max-w-sm" : "sm:grid-cols-2"
          }`}
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onBuy={handleBuy}
              disabled={checkout.isBusy}
            />
          ))}
        </div>

        <p className="mt-4 text-xs text-subheading">
          Payments are processed securely by Razorpay (UPI, cards, netbanking
          and wallets). Credits are added to your account as soon as the
          payment is confirmed.
        </p>
      </section>

      <CheckoutStatusModal state={checkout.state} onClose={checkout.reset} />
    </div>
  );
}
