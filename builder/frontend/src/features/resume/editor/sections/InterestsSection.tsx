import { Heart } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import SimpleListSection from "../components/form/SimpleListSection";

export default function InterestsSection() {
  const interests = useResumeStore((state) => state.resume?.interests ?? []);
  const addInterest = useResumeStore((state) => state.addInterest);
  const removeInterest = useResumeStore((state) => state.removeInterest);

  return (
    <SimpleListSection
      hint="Press Enter or click Add to add your interests."
      placeholder="Open Source"
      items={interests}
      onAdd={addInterest}
      onRemove={removeInterest}
      icon={<Heart size={16} />}
    />
  );
}
