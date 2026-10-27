// Select.tsx
import { useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

/** Native select styled like Input (keeps the OS picker on phones). */
export default function Select({
  label,
  error,
  className = "",
  children,
  ...props
}: Props) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-heading">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          {...props}
          className={`h-12 w-full appearance-none rounded-xl border bg-navbar pl-4 pr-10 text-heading outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-red-500 focus:ring-red-200"
              : "border-border focus:border-border-strong focus:ring-ring"
          } ${className}`}
        >
          {children}
        </select>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-heading/50"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
