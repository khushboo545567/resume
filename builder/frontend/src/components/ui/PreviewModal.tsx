import { useEffect, useId } from "react";
import type { ReactNode } from "react";
import { LayoutTemplate, X } from "lucide-react";

import ModalPortal from "./ModalPortal";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Name of the template the user picked, shown next to the preview. */
  templateName?: string;
  /** Image of the picked template. Without it the modal is a single column. */
  previewSrc?: string;
  /** Blocks closing (Esc, backdrop, X) while something is being saved. */
  busy?: boolean;
  children: ReactNode;
}

/**
 * Dialog with a dark preview panel on the left and a form on the right.
 * Used when someone picks a resume or cover letter template, so they can see
 * what they chose while naming it.
 */
export default function PreviewModal({
  open,
  onClose,
  title,
  description,
  templateName,
  previewSrc,
  busy = false,
  children,
}: PreviewModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onClose]);

  if (!open) return null;

  const handleClose = () => {
    if (!busy) onClose();
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-100 flex items-center justify-center bg-heading/60 p-3 backdrop-blur-sm sm:p-4"
        onClick={handleClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => e.stopPropagation()}
          className={`relative grid max-h-[92vh] w-full overflow-hidden rounded-3xl border border-border-popup bg-popup shadow-2xl animate-in zoom-in-95 ${
            previewSrc ? "max-w-3xl md:grid-cols-[2fr_3fr]" : "max-w-lg"
          }`}
        >
          {/* Preview panel (hidden on small screens) */}
          {previewSrc && (
            <aside className="relative hidden flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-br from-sidebar via-sidebar-hover to-border-sidebar p-6 text-sidebar-text md:flex">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-accent/25 blur-3xl" />

              <img
                src={previewSrc}
                alt={templateName ? `${templateName} preview` : "Template preview"}
                className="relative aspect-[210/297] w-full max-w-[210px] rounded-lg bg-white object-cover object-top shadow-2xl"
              />

              {templateName && (
                <div className="relative text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-soft">
                    Your template
                  </p>
                  <p className="mt-1 text-sm font-semibold">{templateName}</p>
                </div>
              )}
            </aside>
          )}

          {/* Form panel */}
          <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto p-5 sm:p-8">
            <button
              type="button"
              onClick={handleClose}
              disabled={busy}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg p-2 text-heading/60 transition hover:bg-navbar-hover disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {templateName && (
              <span
                className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-btn-hover-bg px-3 py-1 text-xs font-semibold text-subheading ${
                  previewSrc ? "md:hidden" : ""
                }`}
              >
                <LayoutTemplate size={13} />
                {templateName}
              </span>
            )}

            <h2
              id={titleId}
              className="pr-8 text-xl font-bold text-heading sm:text-2xl"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-nav-text">{description}</p>
            )}

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
