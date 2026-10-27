import { useResumeStore } from "../../../../store/resume.store";
import SimpleListSection from "../components/form/SimpleListSection";

export default function AwardsSection() {
  const awards = useResumeStore((state) => state.resume?.awards ?? []);
  const addAward = useResumeStore((state) => state.addAward);
  const removeAward = useResumeStore((state) => state.removeAward);

  return (
    <SimpleListSection
      hint="Press Enter or click Add to add an award."
      placeholder="Winner - Smart India Hackathon"
      items={awards}
      onAdd={addAward}
      onRemove={removeAward}
    />
  );
}
