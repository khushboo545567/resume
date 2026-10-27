import type { ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  items: string[];
  onRemove: (item: string) => void;
  icon?: ReactNode;
}

/** Removable pills (awards, interests, certifications, technologies). */
export default function ChipList({ items, onRemove, icon }: Props) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="max-w-full">
          <button
            type="button"
            onClick={() => onRemove(item)}
            aria-label={`Remove ${item}`}
            className="flex max-w-full items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-left text-sm text-heading transition hover:bg-border-popup"
          >
            {icon && <span className="shrink-0 text-heading/60">{icon}</span>}

            <span className="min-w-0 [overflow-wrap:anywhere]">{item}</span>

            <X size={14} className="shrink-0 text-heading/60" />
          </button>
        </li>
      ))}
    </ul>
  );
}
