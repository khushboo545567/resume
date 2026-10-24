import { useState } from "react";
import type { KeyboardEvent } from "react";
import { Award, X, Plus } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs text-heading/60 sm:text-sm">
          Press Enter or click Add to add a certification. Add a link if you
          want it to show up as a clickable, underlined link on your resume.
        </p>
      </div>

      {/* Resume Heading */}
      <Input
        label="Resume Heading"
        placeholder="Certifications"
        value={certificationsSection?.displayTitle ?? ""}
        onChange={(e) =>
          renameSectionDisplayTitle("certifications", e.target.value)
        }
      />

      {/* Certification Name + Link Inputs + Add Button */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="AWS Certified Cloud Practitioner"
            className="h-12 flex-1 rounded-xl border border-border px-4 outline-none focus:border-border-strong"
          />

          <Button
            type="button"
            leftIcon={<Plus size={18} />}
            onClick={handleAddCertification}
          >
            Add
          </Button>
        </div>

        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Certificate link (optional) — e.g. https://coursera.org/verify/xxxx"
          className="h-12 w-full rounded-xl border border-border px-4 outline-none focus:border-border-strong"
        />
      </div>

      {/* Certification List */}
      <div className="flex flex-wrap gap-3">
        {certifications.map((certification) => (
          <button
            key={certification}
            type="button"
            onClick={() => removeCertification(certification)}
            className="flex items-center gap-2 rounded-full bg-btn-hover-bg px-4 py-2 text-heading transition hover:bg-border-popup"
          >
            <Award size={16} />

            <span>{certification}</span>

            <X size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}
