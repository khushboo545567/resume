// Prices are in rupees, one-time payments (no subscription). Change prices here only.

export type PlanCategory = "resume" | "cover-letter" | "interview" | "all-in-one";

export interface Plan {
  /** Stable id. The checkout API will receive this later. */
  id: string;
  category: PlanCategory;
  name: string;
  price: number;
  features: string[];
}

export const INTERVIEW_QUESTION_OPTIONS = [5, 10, 15] as const;
export type InterviewQuestions = (typeof INTERVIEW_QUESTION_OPTIONS)[number];

export const FREE_FEATURES = [
  "Build your resume manually",
  "Write your cover letter manually",
  "1 AI resume with 2 edits",
  "1 AI cover letter with 2 edits",
  "1 AI interview",
];

export const RESUME_PLANS: Plan[] = [
  {
    id: "resume-ai-5",
    category: "resume",
    name: "Starter",
    price: 25,
    features: ["5 AI resume runs", "10 AI edits"],
  },
  {
    id: "resume-ai-10",
    category: "resume",
    name: "Plus",
    price: 50,
    features: ["10 AI resume runs", "20 AI edits"],
  },
];

export const COVER_LETTER_PLANS: Plan[] = [
  {
    id: "cover-ai-2",
    category: "cover-letter",
    name: "Starter",
    price: 19,
    features: ["2 AI cover letter runs", "4 AI edits"],
  },
  {
    id: "cover-ai-5",
    category: "cover-letter",
    name: "Plus",
    price: 29,
    features: ["5 AI cover letter runs", "10 AI edits"],
  },
];

const INTERVIEW_PRICES: Record<InterviewQuestions, { two: number; five: number }> =
  {
    5: { two: 26, five: 65 },
    10: { two: 52, five: 129 },
    15: { two: 79, five: 199 },
  };

export const getInterviewPlans = (questions: InterviewQuestions): Plan[] => [
  {
    id: `interview-ai-${questions}q-2`,
    category: "interview",
    name: "2 sessions",
    price: INTERVIEW_PRICES[questions].two,
    features: [`2 AI interview sessions`, `${questions} questions each`],
  },
  {
    id: `interview-ai-${questions}q-5`,
    category: "interview",
    name: "5 sessions",
    price: INTERVIEW_PRICES[questions].five,
    features: [`5 AI interview sessions`, `${questions} questions each`],
  },
];

export const ALL_IN_ONE_PLAN: Plan = {
  id: "all-in-one",
  category: "all-in-one",
  name: "All-in-one",
  price: 69,
  features: [
    "2 AI resume runs with 4 edits",
    "2 AI cover letter runs with 4 edits",
    "2 AI interviews (up to 10 questions each)",
  ],
};

export const formatPrice = (price: number): string => `₹${price}`;
