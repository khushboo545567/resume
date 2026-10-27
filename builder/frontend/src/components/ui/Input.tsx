// Input.tsx
import { useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;

  /** Small helper text shown under the field when there is no error. */
  hint?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  required?: boolean;
}

export default function Input({
  label,

  error,

  hint,

  leftIcon,

  rightIcon,

  required,

  className = "",

  ...props
}: InputProps) {
  const autoId = useId();
  const id = props.id ?? autoId;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-heading">
          {label}

          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <div
        className={`flex h-12 items-center rounded-xl border bg-navbar px-4 transition
        has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60

        ${
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-200"
            : "border-border focus-within:border-border-strong focus-within:ring-2 focus-within:ring-ring"
        }`}
      >
        {leftIcon && <div className="mr-3 text-heading/50">{leftIcon}</div>}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          className={`min-w-0 flex-1 bg-transparent text-heading outline-none placeholder:text-heading/40 ${className}`}
          {...props}
        />

        {rightIcon && <div className="ml-3 text-heading/50">{rightIcon}</div>}
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-heading/60">{hint}</p>
      )}
    </div>
  );
}
