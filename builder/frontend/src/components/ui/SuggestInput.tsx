import { useId, useState } from "react";
import type { ReactNode } from "react";

import Input from "./Input";

interface SuggestInputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  autoFocus?: boolean;
  name?: string;

  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;

  /** Called when an option is picked from the list (not for typed text). */
  onPick?: (option: string) => void;

  /** Returns the options to offer for the current text (may be empty). */
  getSuggestions: (text: string) => string[];

  /** Heading shown above the list while the field is empty. */
  emptyHeading?: string;
}

/** Highlights the part of `option` the user has already typed. */
function Highlighted({ option, query }: { option: string; query: string }) {
  const q = query.trim();
  const at = q ? option.toLowerCase().indexOf(q.toLowerCase()) : -1;

  if (at === -1) return <>{option}</>;

  return (
    <>
      {option.slice(0, at)}
      <strong className="font-bold text-heading">
        {option.slice(at, at + q.length)}
      </strong>
      {option.slice(at + q.length)}
    </>
  );
}

/**
 * Text field that offers clickable suggestions while the user types.
 * Free text is always allowed: suggestions only save typing, they never
 * restrict what can be entered.
 *
 * Keyboard: ↑ ↓ move, Enter picks the highlighted option (otherwise the form
 * submits as usual), Esc closes the list without closing the surrounding modal.
 */
export default function SuggestInput({
  value,
  onChange,
  onBlur,
  onPick,
  getSuggestions,
  emptyHeading = "Popular",
  hint,
  ...inputProps
}: SuggestInputProps) {
  const listId = useId();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const options = getSuggestions(value).filter(
    // Nothing to offer once the field already holds exactly that option.
    (option) => option.toLowerCase() !== value.trim().toLowerCase(),
  );
  const showList = open && options.length > 0;
  const activeOption = showList && active >= 0 ? options[active] : undefined;

  const pick = (option: string) => {
    onChange(option);
    onPick?.(option);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!showList) {
        setOpen(true);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((current) => (current + step + options.length) % options.length);
      return;
    }

    if (e.key === "Enter" && activeOption) {
      e.preventDefault(); // pick the option instead of submitting the form
      pick(activeOption);
      return;
    }

    if (e.key === "Escape" && showList) {
      e.stopPropagation(); // close the list, not the modal around it
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div>
      <Input
        {...inputProps}
        value={value}
        // Hidden while the list is open so the two never compete for space.
        hint={showList ? undefined : hint}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={showList ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={
          activeOption ? `${listId}-${active}` : undefined
        }
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
          onBlur?.();
        }}
        onKeyDown={onKeyDown}
      />

      {showList && (
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-popup shadow-lg">
          {!value.trim() && (
            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-heading/50">
              {emptyHeading}
            </p>
          )}

          <ul id={listId} role="listbox">
            {options.map((option, index) => (
              <li
                key={option}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === active}
                // mousedown (not click) so the input keeps focus and its
                // blur handler does not close the list before the pick lands.
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(option);
                }}
                onMouseEnter={() => setActive(index)}
                className={`cursor-pointer px-4 py-2.5 text-sm text-heading/80 ${
                  index === active ? "bg-navbar-hover" : ""
                }`}
              >
                <Highlighted option={option} query={value} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
