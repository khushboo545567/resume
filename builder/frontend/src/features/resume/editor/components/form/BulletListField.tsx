import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Plus, X } from "lucide-react";

import Button from "../../../../../components/ui/Button";

interface Props {
  title: string;
  hint?: string;
  /** Buttons shown next to the title (AI actions). */
  actions?: ReactNode;
  /** Stable keys of the rows (the `id` of each useFieldArray field). */
  ids: string[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  /** The input for one row. It should fill the width it is given. */
  renderInput: (index: number) => ReactNode;
  /** Never remove the last row; an empty row is simply ignored on save. */
  keepOne?: boolean;
}

/**
 * Repeating one-line inputs (responsibilities, achievements, project points).
 *
 * - Enter inside a row adds a new row and moves the cursor to it.
 * - Remove is an icon button, so rows never wrap on a phone.
 */
export default function BulletListField({
  title,
  hint,
  actions,
  ids,
  addLabel,
  onAdd,
  onRemove,
  renderInput,
  keepOne = true,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  const addRow = () => {
    onAdd();

    // Wait for the new row to render, then focus it.
    requestAnimationFrame(() => {
      const inputs = listRef.current?.querySelectorAll<HTMLInputElement>(
        "input:not([type=checkbox])",
      );
      inputs?.[inputs.length - 1]?.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter" || e.defaultPrevented) return;
    if (!(e.target instanceof HTMLInputElement)) return;

    e.preventDefault(); // add a row instead of submitting the whole form
    addRow();
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          {hint && <p className="mt-0.5 text-xs text-heading/60">{hint}</p>}
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      <div ref={listRef} onKeyDown={onKeyDown} className="space-y-3">
        {ids.map((id, index) => (
          <div key={id} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">{renderInput(index)}</div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Remove ${title.toLowerCase()} ${index + 1}`}
              title="Remove"
              onClick={() => onRemove(index)}
              disabled={keepOne && ids.length === 1}
            >
              <X size={18} />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<Plus size={16} />}
        onClick={addRow}
      >
        {addLabel}
      </Button>
    </div>
  );
}
