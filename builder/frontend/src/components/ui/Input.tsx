// Input.tsx
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  required?: boolean;
}

export default function Input({
  label,

  error,

  leftIcon,

  rightIcon,

  required,

  className = "",

  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-heading">
          {label}

          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <div
        className={`flex h-12 items-center rounded-xl border bg-navbar px-4 transition

        ${
          error
            ? "border-red-500"
            : "border-border focus-within:border-border-strong"
        }`}
      >
        {leftIcon && <div className="mr-3 text-heading/50">{leftIcon}</div>}

        <input
          className={`flex-1 bg-transparent text-heading outline-none placeholder:text-heading/40 ${className}`}
          {...props}
        />

        {rightIcon && <div className="ml-3 text-heading/50">{rightIcon}</div>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
