// EmptyResumeState.tsx
import { FilePlus2 } from "lucide-react";

interface Props {
  onCreate: () => void;
}

export default function EmptyResumeState({ onCreate }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-border bg-navbar px-6 py-12 text-center sm:rounded-3xl sm:py-20">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-btn-hover-bg sm:h-20 sm:w-20">
        <FilePlus2 size={32} className="text-subheading" />
      </div>

      <h2 className="mt-5 text-2xl font-bold text-heading sm:mt-6 sm:text-3xl">
        No Resume Yet
      </h2>

      <p className="mt-3 text-sm text-nav-text sm:text-base">
        Create your first ATS-friendly resume.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 w-full rounded-xl bg-btn px-8 py-3 text-btn-text hover:bg-btn-hover sm:mt-8 sm:w-auto"
      >
        + Create Resume
      </button>
    </div>
  );
}
