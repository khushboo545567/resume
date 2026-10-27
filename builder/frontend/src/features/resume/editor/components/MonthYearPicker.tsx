import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface Props {
  value: string; // "YYYY-MM" or ""
  onChange: (value: string) => void;
  disabled?: boolean;
  maxYear?: number;
  placeholder?: string;
  /** Which edge of the field the calendar popover lines up with. */
  align?: "start" | "end";
  /** Older, shorter look (h-11, rounded-lg, top margin) for dense forms. */
  compact?: boolean;
}

export default function MonthYearPicker({
  value,
  onChange,
  disabled,
  maxYear,
  placeholder = "Select month",
  align = "start",
  compact = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedYear, selectedMonth] = value
    ? value.split("-").map(Number)
    : [undefined, undefined];

  const currentYear = new Date().getFullYear();
  const yearCap = maxYear ?? currentYear;
  const [viewYear, setViewYear] = useState(selectedYear || currentYear);

  useEffect(() => {
    if (isOpen) setViewYear(selectedYear || currentYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = value
    ? `${MONTHS[selectedMonth! - 1]} ${selectedYear}`
    : placeholder;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between border border-border bg-navbar px-4 text-left text-heading outline-none transition focus:border-border-strong focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${
          compact ? "mt-1.5 h-11 rounded-lg" : "h-12 rounded-xl"
        }`}
      >
        <span className={value ? "text-heading" : "text-heading/40"}>{label}</span>
        <Calendar size={16} className="text-heading/40" />
      </button>

      {isOpen && !disabled && (
        <div
          className={`absolute z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-popup p-3 shadow-lg ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              aria-label="Previous year"
              className="rounded-lg p-2 text-heading/60 hover:bg-navbar"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-heading">{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => Math.min(y + 1, yearCap))}
              disabled={viewYear >= yearCap}
              aria-label="Next year"
              className="rounded-lg p-2 text-heading/60 hover:bg-navbar disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m, i) => {
              const monthNum = i + 1;
              const isFuture =
                viewYear === currentYear &&
                monthNum > new Date().getMonth() + 1;
              const isSelected =
                selectedYear === viewYear && selectedMonth === monthNum;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={isFuture}
                  onClick={() => {
                    const mm = String(monthNum).padStart(2, "0");
                    onChange(`${viewYear}-${mm}`);
                    setIsOpen(false);
                  }}
                  className={`rounded-lg px-2 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                    isSelected
                      ? "bg-btn text-btn-text"
                      : "text-heading/70 hover:bg-navbar"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="mt-2 w-full rounded-lg py-1.5 text-xs font-medium text-heading/50 hover:bg-navbar"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
