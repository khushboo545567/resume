import { ArrowRight, Plus } from "lucide-react";

interface Props {
  name: string;
  onCreate: () => void;
  onContinue: () => void;
}

export default function WelcomeBanner({ name, onCreate, onContinue }: Props) {
  return (
    <section className="rounded-2xl bg-linear-to-r from-btn via-sidebar to-sidebar-hover p-5 text-btn-text shadow-lg sm:rounded-3xl sm:p-8">
      <div className="flex flex-col items-start justify-between gap-5 sm:gap-6 lg:flex-row lg:items-center">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-btn-text/80 sm:text-sm">
            Welcome Back
          </p>

          <h1 className="mt-2 text-2xl font-bold break-words sm:text-3xl lg:text-4xl">
            Hi, {name} 👋
          </h1>

          <p className="mt-3 max-w-xl text-sm text-btn-text/80 sm:text-base">
            Continue building your ATS-friendly resume and get closer to your
            next job opportunity.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 min-[420px]:flex-row sm:w-auto sm:gap-4">
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 rounded-xl bg-navbar px-5 py-3 text-sm font-semibold text-heading transition hover:scale-105 sm:px-6 sm:text-base"
          >
            <ArrowRight size={18} />
            Continue
          </button>

          <button
            onClick={onCreate}
            className="flex items-center justify-center gap-2 rounded-xl border border-btn-text/30 bg-btn-text/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-btn-text/20 sm:px-6 sm:text-base"
          >
            <Plus size={18} />
            New Resume
          </button>
        </div>
      </div>
    </section>
  );
}
