import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Award, Plus } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import ChipList from "../components/form/ChipList";

export default function CertificationsSection() {
  const resume = useResumeStore((state) => state.resume);

  const certifications = useResumeStore(
    (state) => state.resume?.certifications ?? [],
  );

  const addCertification = useResumeStore((state) => state.addCertification);

  const removeCertification = useResumeStore(
    (state) => state.removeCertification,
  );

  const renameSectionDisplayTitle = useResumeStore(
    (state) => state.renameSectionDisplayTitle,
  );

  const certificationsSection = resume?.sections.find(
    (section) => section.id === "certifications",
  );

  const [value, setValue] = useState("");
  const [link, setLink] = useState("");

  // Add certification
  const handleAddCertification = () => {
    const certification = value.trim();
    const certificationLink = link.trim();

    if (!certification) return;

    const combined = certificationLink
      ? `${certification} - ${certificationLink}`
      : certification;

    addCertification(combined);

    setValue("");
    setLink("");
  };

  // Add certification when pressing Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    e.preventDefault();

    handleAddCertification();
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-heading/60">
        Press Enter or click Add to add a certification. Add a link if you want
        it to show up as a clickable, underlined link on your resume.
      </p>

      <Input
        label="Resume Heading"
        placeholder="Certifications"
        value={certificationsSection?.displayTitle ?? ""}
        onChange={(e) =>
          renameSectionDisplayTitle("certifications", e.target.value)
        }
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="AWS Certified Cloud Practitioner"
              aria-label="Certification name"
            />
          </div>

          <Button
            type="button"
            size="lg"
            leftIcon={<Plus size={18} />}
            onClick={handleAddCertification}
            className="w-full sm:w-auto"
          >
            Add
          </Button>
        </div>

        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Certificate link (optional), e.g. https://coursera.org/verify/xxxx"
          aria-label="Certificate link"
        />
      </div>

      <ChipList
        items={certifications}
        onRemove={removeCertification}
        icon={<Award size={16} />}
      />
    </div>
  );
}
