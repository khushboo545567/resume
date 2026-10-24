import { useResumeStore } from "../../../../store/resume.store";
import CustomSectionItemForm from "../components/CustomSectionItemForm";
import { customSectionConfig } from "../config/customSectionConfig";
import { Plus, Trash2, Pencil } from "lucide-react";

interface Props {
  sectionId: string;
}

export default function CustomSection({ sectionId }: Props) {
  const resume = useResumeStore((state) => state.resume);
  const addCustomSectionItem = useResumeStore(
    (state) => state.addCustomSectionItem,
  );

  const renameCustomSection = useResumeStore(
    (state) => state.renameCustomSection,
  );

  const deleteCustomSection = useResumeStore(
    (state) => state.deleteCustomSection,
  );

  if (!resume) return null;

  const section = resume.customSections.find((item) => item.id === sectionId);

  if (!section) return null;

  const config =
    customSectionConfig[section.id as keyof typeof customSectionConfig] ??
    customSectionConfig.custom;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-heading/60 sm:text-sm">Add unlimited items.</p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              const title = prompt("Enter section name", section.title);

              if (!title?.trim()) return;

              renameCustomSection(section.id, title.trim());
            }}
            className="rounded-lg border border-border p-2 hover:bg-btn-hover-bg"
          >
            <Pencil size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              const ok = confirm(`Delete "${section.title}" section?`);

              if (!ok) return;

              deleteCustomSection(section.id);
            }}
            className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => addCustomSectionItem(section.id)}
            className="flex items-center gap-2 rounded-lg bg-btn px-4 py-2 text-btn-text"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Items */}
      {section.items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-10 text-center text-nav-text">
          No items added yet.
        </div>
      ) : (
        <div className="space-y-5">
          {section.items.map((item) => (
            <CustomSectionItemForm
              key={item.id}
              sectionId={section.id}
              item={item}
              config={config}
            />
          ))}
        </div>
      )}
    </div>
  );
}
