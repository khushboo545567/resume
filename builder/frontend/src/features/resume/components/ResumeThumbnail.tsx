import type { Resume } from "../types/resume.types";

import TechnicalThumbnail from "../thumbnails/TechnicalThumbnail";
import ModernThumbnail from "../thumbnails/ModernThumbnail";
import ExecutiveThumbnail from "../thumbnails/ExecutiveThumbnail";
import StudentThumbnail from "../thumbnails/StudentThumbnail";
import MinimalThumbnail from "../thumbnails/MinimalThumbnail";

interface Props {
  resume: Resume;
}

export default function ResumeThumbnail({
  resume,
}: Props) {
  switch (resume.templateId) {
    case "modern-professional":
      return (
        <ModernThumbnail
          resume={resume}
        />
      );

    case "executive":
      return (
        <ExecutiveThumbnail
          resume={resume}
        />
      );

    case "student":
      return (
        <StudentThumbnail
          resume={resume}
        />
      );

    case "minimal-clean":
      return (
        <MinimalThumbnail
          resume={resume}
        />
      );

    default:
      return (
        <TechnicalThumbnail
          resume={resume}
        />
      );
  }
}