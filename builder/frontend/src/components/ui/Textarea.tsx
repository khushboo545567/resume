// Textarea.tsx
import { useId } from "react";
import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/** Multi-line twin of Input: same border, background and focus ring. */
export default function Textarea({
  label,
  error,
  hint,
  className = "",
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

      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        {...props}
        className={`min-h-24 w-full resize-y rounded-xl border bg-navbar px-4 py-3 text-heading outline-none transition placeholder:text-heading/40 focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-border focus:border-border-strong focus:ring-ring"
        } ${className}`}
      />

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-heading/60">{hint}</p>
      )}
    </div>
  );
}
