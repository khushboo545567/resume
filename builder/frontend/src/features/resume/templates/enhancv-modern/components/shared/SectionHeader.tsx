import type { ReactNode } from "react";
import { EnhancvModernTheme as T } from "../theme.enhancv-modern";

interface Props {
  title: string;
  icon?: ReactNode;
}

export default function SectionHeader({ title, icon }: Props) {
  return (
    <div className={T.spacing.section}>
      <div className="flex items-center justify-center gap-2">
        {icon}

        <h2
          className={`
            uppercase
            tracking-wide
            ${T.fontWeight.heading}
            ${T.fontSize.sectionHeader}
            ${T.colors.heading}
          `}
        >
          {title}
        </h2>
      </div>

      <div
        className={`
          mt-1
          border-b
          ${T.colors.border}
        `}
      />
    </div>
  );
}
