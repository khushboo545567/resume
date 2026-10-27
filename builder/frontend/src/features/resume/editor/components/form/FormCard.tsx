import type { FormEventHandler, ReactNode } from "react";

import Button from "../../../../../components/ui/Button";

interface Props {
  title: string;
  submitLabel: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  children: ReactNode;
  /** Rendered after the footer (AI context modals and the like). */
  extra?: ReactNode;
}

/**
 * Shell shared by the Add/Edit forms: card, title and the Cancel/Save footer.
 *
 * The footer sticks to the bottom of the scroll area, so on a phone the Save
 * button is always reachable however long the form gets. Buttons are stacked
 * full width on small screens and right-aligned from `sm` up.
 */
export default function FormCard({
  title,
  submitLabel,
  onSubmit,
  onCancel,
  children,
  extra,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-border bg-popup p-4 sm:p-6"
    >
      <h2 className="text-lg font-bold text-heading sm:text-xl">{title}</h2>

      {children}

      <div className="sticky bottom-0 z-10 -mx-4 -mb-4 flex flex-col-reverse gap-3 rounded-b-2xl border-t border-border bg-popup/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:-mb-6 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button type="submit" className="w-full sm:w-auto">
          {submitLabel}
        </Button>
      </div>

      {extra}
    </form>
  );
}
