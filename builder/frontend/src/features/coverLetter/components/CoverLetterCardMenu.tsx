import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface Props {
  onEdit: () => void;
  onDelete: () => void;
}

/** Three-dot menu for a cover letter card (same look as ResumeCardMenu). */
export default function CoverLetterCardMenu({ onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Cover letter options"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-2 text-heading transition hover:bg-navbar-hover"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-border-popup bg-popup shadow-xl">
          <button
            type="button"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-heading hover:bg-btn-hover-bg"
          >
            <Pencil size={18} />
            Edit
          </button>

          <hr className="border-border-popup" />

          <button
            type="button"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-5 py-3 text-red-600 hover:bg-red-600/10"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
