// Badge.tsx
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;

  color?: "blue" | "green" | "red" | "yellow" | "gray";
}

const colors = {
  blue: "bg-btn-hover-bg text-subheading",

  green: "bg-green-700/10 text-green-700",

  red: "bg-red-600/10 text-red-600",

  yellow: "bg-orange-500/10 text-orange-600",

  gray: "bg-btn-hover-bg text-nav-text",
};

export default function Badge({
  children,

  color = "blue",
}: BadgeProps) {
  return (
    <span
      className={`
      inline-flex
      items-center
      rounded-full
      px-3
      py-1
      text-xs
      font-semibold
      ${colors[color]}
      `}
    >
      {children}
    </span>
  );
}
