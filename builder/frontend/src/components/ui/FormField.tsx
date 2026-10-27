// FormField.tsx
import type { ReactNode } from "react";

interface Props {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/**
 * Label + message wrapper for controls that are not a plain Input
 * (date pickers, custom widgets), so they line up with the Input fields.
 */
export default function FormField({ label, error, hint, children }: Props) {
  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-heading">{label}</span>

      {children}

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-heading/60">{hint}</p>
      )}
    </div>
  );
}
