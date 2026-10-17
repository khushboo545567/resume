//       <p className="mx-auto mt-4 max-w-md text-nav-text">
//         Build an ATS-friendly resume in just a few minutes. Create your first
//         resume to get started.

// EmptyState.tsx
import { FilePlus2 } from "lucide-react";

import Button from "../../../components/ui/Button";

interface Props {
  onCreate: () => void;
}

export default function EmptyState({ onCreate }: Props) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-navbar p-16 text-center shadow-sm">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-btn-hover-bg">
        <FilePlus2 size={46} className="text-subheading" />
      </div>

      <h2 className="mt-8 text-3xl font-bold text-heading">No Resume Yet</h2>

      <p className="mx-auto mt-4 max-w-md text-nav-text">
        Build an ATS-friendly resume in just a few minutes. Create your first
        resume to get started.
      </p>

      <div className="mt-8">
        <Button onClick={onCreate}>Create Resume</Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-navbar-hover p-5">
          <h3 className="font-semibold text-heading">ATS Friendly</h3>

          <p className="mt-2 text-sm text-nav-text">
            Optimized for recruiters and applicant tracking systems.
          </p>
        </div>

        <div className="rounded-xl bg-navbar-hover p-5">
          <h3 className="font-semibold text-heading">Live Preview</h3>

          <p className="mt-2 text-sm text-nav-text">
            Instantly see every change while editing your resume.
          </p>
        </div>

        <div className="rounded-xl bg-navbar-hover p-5">
          <h3 className="font-semibold text-heading">AI Ready</h3>

          <p className="mt-2 text-sm text-nav-text">
            Generate summaries and improve resume content using AI.
          </p>
        </div>
      </div>
    </div>
  );
}
