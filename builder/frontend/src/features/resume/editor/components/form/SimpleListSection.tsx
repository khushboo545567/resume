import { useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Plus } from "lucide-react";

import Button from "../../../../../components/ui/Button";
import Input from "../../../../../components/ui/Input";
import ChipList from "./ChipList";

interface Props {
  hint: string;
  placeholder: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  icon?: ReactNode;
}

/** One text field + Add button + removable pills (Awards, Interests). */
export default function SimpleListSection({
  hint,
  placeholder,
  items,
  onAdd,
  onRemove,
  icon,
}: Props) {
  const [value, setValue] = useState("");

  const add = () => {
    const item = value.trim();
    if (!item) return;

    onAdd(item);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    add();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-heading/60">{hint}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label={placeholder}
          />
        </div>

        <Button
          type="button"
          size="lg"
          leftIcon={<Plus size={18} />}
          onClick={add}
          className="w-full sm:w-auto"
        >
          Add
        </Button>
      </div>

      <ChipList items={items} onRemove={onRemove} icon={icon} />
    </div>
  );
}
