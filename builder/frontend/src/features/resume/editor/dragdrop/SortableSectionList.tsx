import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useResumeStore } from "../../../../store/resume.store";
import SortableSectionItem from "./SortableSectionItem";

interface Props {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function SortableSectionList({
  activeSection,
  onSectionChange,
}: Props) {
  const resume = useResumeStore((state) => state.resume);

  const updateSections = useResumeStore((state) => state.updateSections);
  const toggleSection = useResumeStore((state) => state.toggleSection);

  const sensors = useSensors(useSensor(PointerSensor));

  if (!resume) return null;

  const sections = [...resume.sections].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((item) => item.id === active.id);

    const newIndex = sections.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(sections, oldIndex, newIndex).map(
      (section, index) => ({
        ...section,
        order: index + 1,
      }),
    );

    updateSections(reordered);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              id={section.id}
              title={section.title}
              enabled={section.enabled}
              active={
                section.type === "custom"
                  ? activeSection === section.id
                  : activeSection === section.type
              }
              onClick={() =>
                onSectionChange(
                  section.type === "custom" ? section.id : section.type,
                )
              }
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
