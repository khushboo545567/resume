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
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-border bg-gradient-to-b from-popup/70 to-navbar/40 px-4 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sidebar to-btn text-gold-soft shadow-lg ring-8 ring-btn-hover-bg">
        {icon}
      </div>

      <p className="text-lg font-bold text-display">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-nav-text">{text}</p>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 h-11 rounded-xl bg-btn px-6 shadow-md hover:-translate-y-0.5 text-sm font-semibold text-btn-text transition hover:bg-btn-hover"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
