import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useResumeStore } from "../../../../store/resume.store";

import {
  getResumeById,
} from "../../services/resume.service";

import { DefaultResumeSections } from "../../constants/defaultSections";

export const useResume = () => {

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const resume = useResumeStore(
  (state) => state.resume
);

const setResume = useResumeStore(
  (state) => state.setResume
);

  const fetchResume = async () => {

    if (!id) return;

    try {

      const data = await getResumeById(id);

// Add all missing default sections automatically
const missingSections = DefaultResumeSections.filter(
  (defaultSection) =>
    !data.sections.some(
      (section) => section.type === defaultSection.type
    )
);

if (missingSections.length > 0) {
  data.sections.push(...missingSections);

  data.sections = data.sections
    .sort((a, b) => a.order - b.order)
    .map((section, index) => ({
      ...section,
      order: index + 1,
    }));
}

setResume(data);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchResume();

  }, [id]);

 return {
  loading,
  resume,
  setResume,
  refetch: fetchResume,
  resumeId: id,
};

};