import { createContext, useContext } from "react";
import { create } from "zustand";

import type {
  Resume,
  ResumeSection,
  CustomSection,
  SkillCategory,
} from "../features/resume/types/resume.types";

interface ResumeState {
  resume: Resume | null;

  setResume: (resume: Resume) => void;

  updatePersonalInfo: (data: Partial<Resume["personalInfo"]>) => void;

  updateSummary: (summary: string) => void;

  updateExperience: (experience: Resume["experience"]) => void;

  addExperience: (experience: Resume["experience"][0]) => void;

  deleteExperience: (index: number) => void;

  updateExperienceItem: (
    index: number,
    experience: Resume["experience"][0],
  ) => void;

  addInternship: (internship: Resume["internships"][0]) => void;
  updateInternshipItem: (
    index: number,
    internship: Resume["internships"][0],
  ) => void;
  deleteInternship: (index: number) => void;

  addEducation: (education: Resume["education"][number]) => void;

  updateEducationItem: (
    index: number,
    education: Resume["education"][number],
  ) => void;

  deleteEducation: (index: number) => void;

  addSkill: (category: string, skill: string) => void;

  removeSkill: (category: string, skill: string) => void;

  updateSkills: (skills: SkillCategory[]) => void;
  addCategory: (title: string) => void;

  removeCategory: (title: string) => void;

  addProject: (project: Resume["projects"][number]) => void;

  updateProject: (index: number, project: Resume["projects"][number]) => void;

  deleteProject: (index: number) => void;

  addLanguage: (language: { name: string; level: string }) => void;

  removeLanguage: (name: string) => void;

  updateLanguageLevel: (name: string, level: string) => void;

  addCertification: (certification: string) => void;

  removeCertification: (certification: string) => void;

  addAward: (award: string) => void;

  removeAward: (award: string) => void;

  addInterest: (interest: string) => void;

  removeInterest: (interest: string) => void;

  updateResumeSettings: (data: {
    title?: string;
    targetRole?: string;
    templateId?: string;
    status?: "draft" | "completed";
  }) => void;

  updateTemplate: (templateId: Resume["templateId"]) => void;

  updateSections: (sections: ResumeSection[]) => void;

  toggleSection: (id: string) => void;

  addCustomSection: (title: string) => void;

  addCustomSectionItem: (sectionId: string) => void;

  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    field: "title" | "subtitle" | "startDate" | "endDate" | "description",
    value: string,
  ) => void;

  deleteCustomSectionItem: (sectionId: string, itemId: string) => void;

  renameCustomSection: (sectionId: string, title: string) => void;
  renameSectionDisplayTitle: (sectionId: string, displayTitle: string) => void;

  deleteCustomSection: (sectionId: string) => void;

  renameSection: (sectionId: string, title: string) => void;

  addStrength: (strength: Resume["strengths"][0]) => void;

  updateStrength: (index: number, strength: Resume["strengths"][0]) => void;

  deleteStrength: (index: number) => void;

  addAchievement: (achievement: string) => void;

  updateAchievement: (index: number, achievement: string) => void;

  removeAchievement: (achievement: string) => void;
}

const useBaseResumeStore = create<ResumeState>((set) => ({
  resume: null,

  setResume: (resume) =>
    set({
      resume,
    }),

  updatePersonalInfo: (data) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,

          personalInfo: {
            ...state.resume.personalInfo,
            ...data,
          },
        },
      };
    }),

  updateSummary: (summary) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            summary,
          }
        : null,
    })),

  updateExperience: (experience) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          experience,
        },
      };
    }),

  addExperience: (experience) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          experience: [...state.resume.experience, experience],
        },
      };
    }),

  deleteExperience: (index) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          experience: state.resume.experience.filter((_, i) => i !== index),
        },
      };
    }),

  updateExperienceItem: (index, experience) =>
    set((state) => {
      if (!state.resume) return state;

      const updatedExperience = [...state.resume.experience];

      updatedExperience[index] = experience;

      return {
        resume: {
          ...state.resume,
          experience: updatedExperience,
        },
      };
    }),

  addEducation: (education) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          education: [...state.resume.education, education],
        },
      };
    }),

  updateEducationItem: (index, education) =>
    set((state) => {
      if (!state.resume) return state;

      const updated = [...state.resume.education];

      updated[index] = education;

      return {
        resume: {
          ...state.resume,
          education: updated,
        },
      };
    }),

  deleteEducation: (index) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          education: state.resume.education.filter((_, i) => i !== index),
        },
      };
    }),

  addSkill: (category, skill) =>
    set((state) => {
      if (!state.resume) return state;

      const exists = state.resume.skills.find(
        (item) => item.title.toLowerCase() === category.toLowerCase(),
      );

      if (!exists) {
        return {
          resume: {
            ...state.resume,
            skills: [
              ...state.resume.skills,
              {
                title: category,
                skills: [skill],
              },
            ],
          },
        };
      }

      return {
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((item) =>
            item.title.toLowerCase() === category.toLowerCase()
              ? {
                  ...item,
                  skills: item.skills.includes(skill)
                    ? item.skills
                    : [...item.skills, skill],
                }
              : item,
          ),
        },
      };
    }),
  removeSkill: (category, skill) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          skills: state.resume.skills.map((item) =>
            item.title === category
              ? {
                  ...item,
                  skills: item.skills.filter((s) => s !== skill),
                }
              : item,
          ),
        },
      };
    }),

  addProject: (project) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          projects: [...state.resume.projects, project],
        },
      };
    }),

  updateProject: (index, project) =>
    set((state) => {
      if (!state.resume) return state;

      const updated = [...state.resume.projects];

      updated[index] = project;

      return {
        resume: {
          ...state.resume,
          projects: updated,
        },
      };
    }),

  deleteProject: (index) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          projects: state.resume.projects.filter((_, i) => i !== index),
        },
      };
    }),

  addLanguage: (language) =>
    set((state) => {
      if (!state.resume) return state;

      if (
        state.resume.languages.some(
          (l) => l.name.toLowerCase() === language.name.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          languages: [...state.resume.languages, language],
        },
      };
    }),

  removeLanguage: (name) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          languages: state.resume.languages.filter((l) => l.name !== name),
        },
      };
    }),

  updateLanguageLevel: (name, level) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          languages: state.resume.languages.map((l) =>
            l.name === name ? { ...l, level } : l,
          ),
        },
      };
    }),

  addCertification: (certification) =>
    set((state) => {
      if (!state.resume) return state;

      if (
        state.resume.certifications.some(
          (c) => c.toLowerCase() === certification.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          certifications: [...state.resume.certifications, certification],
        },
      };
    }),

  removeCertification: (certification) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.filter(
            (c) => c !== certification,
          ),
        },
      };
    }),

  addAward: (award) =>
    set((state) => {
      if (!state.resume) return state;

      if (
        state.resume.awards.some((a) => a.toLowerCase() === award.toLowerCase())
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          awards: [...state.resume.awards, award],
        },
      };
    }),

  removeAward: (award) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          awards: state.resume.awards.filter((a) => a !== award),
        },
      };
    }),

  addInterest: (interest) =>
    set((state) => {
      if (!state.resume) return state;

      if (
        state.resume.interests.some(
          (i) => i.toLowerCase() === interest.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          interests: [...state.resume.interests, interest],
        },
      };
    }),

  removeInterest: (interest) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          interests: state.resume.interests.filter((i) => i !== interest),
        },
      };
    }),

  updateResumeSettings: (
    data: any, // data ka proper type daal do
  ) =>
    set((state) => ({
      resume: state.resume
        ? {
            ...state.resume,
            ...data,
          }
        : state.resume,
    })),

  updateTemplate: (templateId) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          templateId,
        },
      };
    }),

  // ... all your existing actions

  updateSkills: (newSkills: SkillCategory[]) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          skills: newSkills,
        },
      };
    }),

  updateSections: (sections) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          sections,
        },
      };
    }),

  toggleSection: (id) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((section) =>
            section.id === id
              ? {
                  ...section,
                  enabled: !section.enabled,
                }
              : section,
          ),
        },
      };
    }),

  //       customSections: [
  //         ...state.resume.customSections,
  //         newCustomSection,
  //       ],

  addCustomSection: (title) =>
    set((state) => {
      if (!state.resume) return state;

      const id = title.toLowerCase().replace(/\s+/g, "-");

      const nextOrder = state.resume.sections.length + 1;

      const newCustomSection: CustomSection = {
        id,
        type: "custom",
        title,
        enabled: true,
        order: nextOrder,
        items: [],
      };

      return {
        resume: {
          ...state.resume,

          customSections: [...state.resume.customSections, newCustomSection],

          sections: [
            ...state.resume.sections,
            {
              id,
              type: "custom",
              title,
              displayTitle: "",
              enabled: true,
              order: nextOrder,
            },
          ],
        },
      };
    }),

  addCustomSectionItem: (sectionId) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,

          customSections: state.resume.customSections.map((section) => {
            if (section.id !== sectionId) return section;

            return {
              ...section,

              items: [
                ...section.items,
                {
                  id: crypto.randomUUID(),

                  title: "",

                  subtitle: "",

                  startDate: "",

                  endDate: "",

                  description: "",
                },
              ],
            };
          }),
        },
      };
    }),

  updateCustomSectionItem: (sectionId, itemId, field, value) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          customSections: state.resume.customSections.map((section) => {
            if (section.id !== sectionId) return section;

            return {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            };
          }),
        },
      };
    }),

  deleteCustomSectionItem: (sectionId, itemId) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          customSections: state.resume.customSections.map((section) => {
            if (section.id !== sectionId) return section;

            return {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            };
          }),
        },
      };
    }),

  renameCustomSection: (sectionId, title) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,

          customSections: state.resume.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  title,
                }
              : section,
          ),

          sections: state.resume.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  title,
                }
              : section,
          ),
        },
      };
    }),

  deleteCustomSection: (sectionId) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,

          customSections: state.resume.customSections.filter(
            (section) => section.id !== sectionId,
          ),

          sections: state.resume.sections.filter(
            (section) => section.id !== sectionId,
          ),
        },
      };
    }),

  addCategory: (title) =>
    set((state) => {
      if (!state.resume) return state;

      if (
        state.resume.skills.some(
          (c) => c.title.toLowerCase() === title.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          skills: [
            ...state.resume.skills,
            {
              title,
              skills: [],
            },
          ],
        },
      };
    }),

  removeCategory: (title) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          skills: state.resume.skills.filter((c) => c.title !== title),
        },
      };
    }),

  addInternship: (internship) =>
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          internships: [...state.resume.internships, internship],
        },
      };
    }),

  updateInternshipItem: (index, internship) =>
    set((state) => {
      if (!state.resume) return state;
      const updated = [...state.resume.internships];
      updated[index] = internship;
      return {
        resume: {
          ...state.resume,
          internships: updated,
        },
      };
    }),

  deleteInternship: (index) =>
    set((state) => {
      if (!state.resume) return state;
      return {
        resume: {
          ...state.resume,
          internships: state.resume.internships.filter((_, i) => i !== index),
        },
      };
    }),

  renameSection: (sectionId, title) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((section) =>
            section.id === sectionId ? { ...section, title } : section,
          ),
        },
      };
    }),

  renameSectionDisplayTitle: (sectionId, displayTitle) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          sections: state.resume.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  displayTitle,
                }
              : section,
          ),
        },
      };
    }),

  addStrength: (strength) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          strengths: [...state.resume.strengths, strength],
        },
      };
    }),

  updateStrength: (index, strength) =>
    set((state) => {
      if (!state.resume) return state;

      const updated = [...state.resume.strengths];

      updated[index] = strength;

      return {
        resume: {
          ...state.resume,
          strengths: updated,
        },
      };
    }),

  deleteStrength: (index) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          strengths: state.resume.strengths.filter((_, i) => i !== index),
        },
      };
    }),

  addAchievement: (achievement) =>
    set((state) => {
      if (!state.resume) return state;

      const trimmedAchievement = achievement.trim();

      if (!trimmedAchievement) {
        return state;
      }

      if (
        state.resume.achievements.some(
          (a) => a.toLowerCase() === trimmedAchievement.toLowerCase(),
        )
      ) {
        return state;
      }

      return {
        resume: {
          ...state.resume,
          achievements: [...state.resume.achievements, trimmedAchievement],
        },
      };
    }),

  removeAchievement: (achievement) =>
    set((state) => {
      if (!state.resume) return state;

      return {
        resume: {
          ...state.resume,
          achievements: state.resume.achievements.filter(
            (a) => a !== achievement,
          ),
        },
      };
    }),

  updateAchievement: (index, achievement) =>
    set((state) => {
      if (!state.resume) return state;

      const trimmedAchievement = achievement.trim();

      if (!trimmedAchievement) {
        return state;
      }

      const updatedAchievements = [...state.resume.achievements];

      updatedAchievements[index] = trimmedAchievement;

      return {
        resume: {
          ...state.resume,
          achievements: updatedAchievements,
        },
      };
    }),

  // UNSER SAB
}));

/**
 * Read-only override for `useResumeStore`.
 *
 * Wrap a subtree in `<ResumeOverrideContext.Provider value={resume}>` and every
 * `useResumeStore(selector)` call inside it reads from that resume instead of
 * the global editor store. Used by the resume-card thumbnails so the real
 * templates can render any resume without touching the editor's state.
 * With no provider (value `null`) the hook behaves exactly as before.
 */
export const ResumeOverrideContext = createContext<Resume | null>(null);

// Actions are inert inside an override so a thumbnail can never write to the
// real store (or anywhere else).
const noop = () => undefined;

const overrideStateCache = new WeakMap<Resume, ResumeState>();

function getOverrideState(resume: Resume): ResumeState {
  let state = overrideStateCache.get(resume);
  if (!state) {
    state = new Proxy({ resume } as unknown as ResumeState, {
      get: (target, key) =>
        key in target ? Reflect.get(target, key) : noop,
    });
    overrideStateCache.set(resume, state);
  }
  return state;
}

const identity = (state: ResumeState) => state;
const constantSelector = () => null;

function useResumeStoreWithOverride<T>(
  selector: (state: ResumeState) => T = identity as unknown as (
    state: ResumeState,
  ) => T,
): T {
  const override = useContext(ResumeOverrideContext);

  // Hooks must run unconditionally. With an override active we subscribe to
  // the real store with a constant selector so editor changes never re-render
  // the thumbnail.
  const fromStore = useBaseResumeStore(
    override ? (constantSelector as unknown as typeof selector) : selector,
  );

  return override ? selector(getOverrideState(override)) : fromStore;
}

// Keep the static API (getState, setState, subscribe, getInitialState) intact.
export const useResumeStore = Object.assign(
  useResumeStoreWithOverride,
  useBaseResumeStore,
) as typeof useBaseResumeStore;
