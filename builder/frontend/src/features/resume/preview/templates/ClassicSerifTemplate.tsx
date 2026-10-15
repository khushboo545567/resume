import { useResumeStore } from "../../../../store/resume.store";
import DynamicSectionRenderer from "../components/DynamicSectionRenderer";
import { ClassicSerifSectionRegistry } from "../components/SectionRegistry.classic-serif";
import { MapPin, Mail, Phone } from "lucide-react";
import ClassicSerifCustomSection from "../components/sections/classic-serif/CustomSectionPreview";
import { FaLinkedin } from "react-icons/fa";

export default function ClassicSerifTemplate() {
  const resume = useResumeStore((state) => state.resume);
  if (!resume) return null;

  const { personalInfo } = resume;

  return (
    <div className="min-h-[1120px] bg-white px-12 py-10 text-[13px] text-slate-900">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-serif text-[28px] font-bold tracking-wide text-slate-900">
          {personalInfo.fullName}
        </h1>

        {personalInfo.title && (
          <p className="mt-1 font-serif text-[15px] italic text-slate-700">
            {personalInfo.title}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11.5px] text-slate-600">
          {personalInfo.address && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {personalInfo.address}
            </span>
          )}
          {personalInfo.email && (
            <>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <Mail size={12} /> {personalInfo.email}
              </span>
            </>
          )}
          {personalInfo.phone && (
            <>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1">
                <Phone size={12} /> {personalInfo.phone}
              </span>
            </>
          )}
          {personalInfo.linkedIn && (
            <>
              <span className="text-slate-300">|</span>

              <a
                href={
                  personalInfo.linkedIn.startsWith("http://") ||
                  personalInfo.linkedIn.startsWith("https://")
                    ? personalInfo.linkedIn
                    : `https://${personalInfo.linkedIn}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <FaLinkedin size={12} />
                LinkedIn
              </a>
            </>
          )}
        </div>
      </div>

      {/* Body — sections rendered in order via registry */}
      <div className="mt-6">
        <DynamicSectionRenderer
          registry={ClassicSerifSectionRegistry}
          customSectionComponent={ClassicSerifCustomSection}
        />
      </div>
    </div>
  );
}
