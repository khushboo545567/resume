import { useRef } from "react";

interface BoldableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BoldableInput({
  value,
  onChange,
  placeholder,
}: BoldableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleBold = () => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start === end) return; // nothing selected, do nothing

    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);

    const alreadyBold = before.endsWith("**") && after.startsWith("**");

    let newValue: string;
    let newStart: number;
    let newEnd: number;

    if (alreadyBold) {
      // Un-bold: remove the surrounding **
      newValue = before.slice(0, -2) + selected + after.slice(2);
      newStart = start - 2;
      newEnd = end - 2;
    } else {
      // Bold: wrap selection in **
      newValue = before + "**" + selected + "**" + after;
      newStart = start;
      newEnd = end + 4;
    }

    onChange(newValue);

    // restore selection after React re-renders
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(newStart, newEnd);
    });
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-navbar px-4 transition placeholder:text-heading/40 text-heading outline-none focus:border-border-strong focus:ring-2 focus:ring-ring"
      />
      <button
        type="button"
        onClick={toggleBold}
        title="Bold selected text"
        aria-label="Bold selected text"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-navbar font-bold text-heading transition hover:bg-btn-hover-bg"
      >
        B
      </button>
    </div>
  );
}
