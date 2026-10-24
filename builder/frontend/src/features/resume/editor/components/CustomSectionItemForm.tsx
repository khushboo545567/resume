import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { useResumeStore } from "../../../../store/resume.store";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useGenerateCustomSection } from "../../../ai/hooks/useGenerateCustomSection";
import AICustomSectionContextModal from "../../../ai/components/AICustomSectionContextModal";
import MonthYearPicker from "./MonthYearPicker";

interface Props {
  sectionId: string;

  config: {
    title: string;

    fields: {
      title: string;
      subtitle: string;
      startDate: string;
      endDate: string;
      description: string;
    };
  };

  item: {
    id: string;
    title: string;
    subtitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  };
}
export default function CustomSectionItemForm({
  sectionId,
  item,
  config,
}: Props) {
  const updateCustomSectionItem = useResumeStore(
    (state) => state.updateCustomSectionItem,
  );

  const [showContextModal, setShowContextModal] = useState(false);
  const { mutateAsync: generateDescription, isPending: isGenerating } =
    useGenerateCustomSection();

  const handleGenerateClick = () => {
    if (!item.title?.trim()) {
      alert("Please enter the title first.");
      return;
    }
    setShowContextModal(true);
  };

  const handleContextSubmit = async (context: {
    whatDone: string;
    problemSolved: string;
    teamRole: string;
    result: string;
  }) => {
    try {
      const result = await generateDescription({
        sectionType: sectionId,
        itemTitle: item.title,
        itemSubtitle: item.subtitle,
        context,
      });

      updateCustomSectionItem(sectionId, item.id, "description", result);
      setShowContextModal(false);
    } catch (error) {
      console.error("Generate failed:", error);
      alert("Failed to generate with AI. Please try again.");
    }
  };

  const deleteCustomSectionItem = useResumeStore(
    (state) => state.deleteCustomSectionItem,
  );
  return (
    <div className="space-y-4 rounded-xl border border-border bg-popup p-5">
      <Input
        label={config.fields.title}
        placeholder={config.fields.title}
        value={item.title}
        onChange={(e) =>
          updateCustomSectionItem(sectionId, item.id, "title", e.target.value)
        }
      />

      <Input
        label={config.fields.subtitle}
        placeholder={config.fields.subtitle}
        value={item.subtitle ?? ""}
        onChange={(e) =>
          updateCustomSectionItem(
            sectionId,
            item.id,
            "subtitle",
            e.target.value,
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-heading">
            {config.fields.startDate}
          </label>
          <MonthYearPicker
            value={item.startDate ?? ""}
            onChange={(value) =>
              updateCustomSectionItem(sectionId, item.id, "startDate", value)
            }
            placeholder={config.fields.startDate}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-heading">
            {config.fields.endDate}
          </label>
          <MonthYearPicker
            value={item.endDate ?? ""}
            onChange={(value) =>
              updateCustomSectionItem(sectionId, item.id, "endDate", value)
            }
            placeholder={config.fields.endDate}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-heading">
            {config.fields.description}
          </label>
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="rounded-lg bg-btn px-3 py-1.5 text-btn-text text-sm flex items-center gap-2 hover:bg-btn-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? "Generating..." : "✨ Generate with AI"}
          </button>
        </div>
        <Textarea
          placeholder={config.fields.description}
          value={item.description ?? ""}
          onChange={(e) =>
            updateCustomSectionItem(
              sectionId,
              item.id,
              "description",
              e.target.value,
            )
          }
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => deleteCustomSectionItem(sectionId, item.id)}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:opacity-90"
        >
          <Trash2 size={18} />
          Delete Item
        </button>
      </div>

      <AICustomSectionContextModal
        open={showContextModal}
        onClose={() => setShowContextModal(false)}
        onSubmit={handleContextSubmit}
        loading={isGenerating}
      />
    </div>
  );
}
