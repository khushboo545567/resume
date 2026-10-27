// Checkbox.tsx
import type { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
}

/** Checkbox with a large tap area: the whole row toggles it. */
export default function Checkbox({ label, className = "", ...props }: Props) {
  return (
    <label
      className={`flex w-fit cursor-pointer items-center gap-3 py-1 text-sm text-heading ${className}`}
    >
      <input
        type="checkbox"
        className="h-5 w-5 shrink-0 cursor-pointer rounded accent-btn"
        {...props}
      />
      {label}
    </label>
  );
}
