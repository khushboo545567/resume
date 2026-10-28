import SortableSectionList from "../dragdrop/SortableSectionList";
import { useState } from "react";
import { Plus, LayoutTemplate, Settings } from "lucide-react";
import AddSectionModal from "../modals/AddSectionModal";
import { useResumeStore } from "../../../../store/resume.store";

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function SectionNavList({
  activeSection,
  onSectionChange,
}: Props) {
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const addCustomSection = useResumeStore((state) => state.addCustomSection);

  const handleAddSection = (title: string) => {
    addCustomSection(title);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Section list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3">
        {/* Utility section nav */}
        <div className="mb-3 border-b border-heading/15 pb-3 space-y-0.5">
          <button
            onClick={() => onSectionChange("templates")}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeSection === "templates"
                ? "bg-btn text-btn-text shadow-sm"
                : "text-heading hover:bg-navbar/60"
            }`}
          >
            <LayoutTemplate size={15} className="shrink-0" />
            Templates
          </button>

          <button
            onClick={() => onSectionChange("settings")}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeSection === "settings"
                ? "bg-btn text-btn-text shadow-sm"
                : "text-heading hover:bg-navbar/60"
            }`}
          >
            <Settings size={15} className="shrink-0" />
            Settings
          </button>
        </div>

        <SortableSectionList
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>

      {/* Add section button */}
      <div className="shrink-0 px-3 py-3 border-t border-heading/15 bg-section-panel">
        <button
          onClick={() => setOpenAddSectionModal(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-heading/40 py-2 text-xs font-semibold text-heading transition hover:border-heading hover:bg-navbar/60"
        >
          <Plus size={14} />
          Add Section
        </button>
      </div>

      <AddSectionModal
        open={openAddSectionModal}
        onClose={() => setOpenAddSectionModal(false)}
        onSelect={handleAddSection}
      />
    </div>
  );
}
