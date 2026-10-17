import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface Props {
  value: string; // comma-separated
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
}

export default function TagAutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const tags = value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const commitTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...tags, tag].join(", "));
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag).join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const filteredSuggestions = suggestions
    .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
    .filter((s) =>
      inputValue ? s.toLowerCase().includes(inputValue.toLowerCase()) : true,
    )
    .slice(0, 8);

  return (
    <div>

      <div className="mt-1.5 flex min-h-11 w-full flex-wrap items-center gap-2 rounded-lg border border-border bg-navbar px-3 py-2 focus-within:border-border-strong focus-within:ring-2 focus-within:ring-ring">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitTag(inputValue)}
          placeholder={placeholder}
          className="min-w-40 flex-1 bg-transparent text-sm text-heading outline-none"
        />
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-btn-hover-bg px-2 py-1 text-xs font-medium text-heading"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-heading/50 hover:text-red-600"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {filteredSuggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filteredSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commitTag(s)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-heading/70 transition hover:border-border-strong hover:text-heading"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
