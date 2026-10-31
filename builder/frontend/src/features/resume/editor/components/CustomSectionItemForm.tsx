import Button from "../../../../components/ui/Button";
import FormField from "../../../../components/ui/FormField";
import Input from "../../../../components/ui/Input";
import Textarea from "../../../../components/ui/Textarea";
import { useResumeStore } from "../../../../store/resume.store";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useGenerateCustomSection } from "../../../ai/hooks/useGenerateCustomSection";
import AICustomSectionContextModal from "../../../ai/components/AICustomSectionContextModal";
import AIGenerateButton from "../../../ai/components/AIGenerateButton";
import MonthYearPicker from "./MonthYearPicker";
import { isOutOfCreditsError } from "../../../../api/axios";

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
      // No credits: the app-wide "buy credits" prompt is already showing.
      if (isOutOfCreditsError(error)) return;
      console.error("Generate failed:", error);
      alert("Failed to generate with AI. Please try again.");
    }
  };

  const deleteCustomSectionItem = useResumeStore(
    (state) => state.deleteCustomSectionItem,
  );
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-popup p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
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

        <FormField label={config.fields.startDate}>
          <MonthYearPicker
            value={item.startDate ?? ""}
            onChange={(value) =>
              updateCustomSectionItem(sectionId, item.id, "startDate", value)
            }
            placeholder={config.fields.startDate}
          />
        </FormField>

        <FormField label={config.fields.endDate}>
          <MonthYearPicker
            value={item.endDate ?? ""}
            onChange={(value) =>
              updateCustomSectionItem(sectionId, item.id, "endDate", value)
            }
            placeholder={config.fields.endDate}
            align="end"
          />
        </FormField>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label
            htmlFor={`${item.id}-description`}
            className="text-sm font-semibold text-heading"
          >
            {config.fields.description}
          </label>

          <AIGenerateButton
            onClick={handleGenerateClick}
            loading={isGenerating}
          />
        </div>

        <Textarea
          id={`${item.id}-description`}
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
        <Button
          type="button"
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={16} />}
          onClick={() => deleteCustomSectionItem(sectionId, item.id)}
        >
          Delete item
        </Button>
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
