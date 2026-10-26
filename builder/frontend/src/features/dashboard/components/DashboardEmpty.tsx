import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  text: string;
  buttonLabel: string;
  onClick: () => void;
}

export default function DashboardEmpty({
  icon,
  title,
  text,
  buttonLabel,
  onClick,
}: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border px-4 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-btn-hover-bg text-subheading">
        {icon}
      </div>

      <p className="font-semibold text-heading">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-nav-text">{text}</p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 h-10 rounded-xl bg-btn px-5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
