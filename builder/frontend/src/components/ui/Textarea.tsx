// Textarea.tsx
import type { TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-heading">{label}</label>
      )}

      <textarea
        {...props}
        className={`w-full rounded-lg border border-border bg-navbar px-3 py-2 text-heading outline-none placeholder:text-heading/40 focus:border-border-strong focus:ring-2 focus:ring-ring ${className}`}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
