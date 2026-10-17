import { useRef, useState, useCallback } from "react";
import { Mail, Phone, MapPin, Camera } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import { useResumeStore } from "../../../../../../store/resume.store";
import { uploadProfilePhoto } from "../../../../../../services/upload.service";

import { ExecutiveSidebarTheme as T } from "../theme.executive-sidebar";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

const clamp = (val: number, max: number) =>
  Math.max(-max, Math.min(max, val));

export default function Sidebar() {
  const resume = useResumeStore((state) => state.resume);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const dragInfo = useRef<{
    startX: number;
    startY: number;
    startPos: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  // Hooks must run on every render, so they live ABOVE the early return below.
  const zoom = resume?.personalInfo.photoZoom ?? 1;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragInfo.current) return;

      // Measure now: state set in handleMouseDown is not visible to this closure yet,
      // which made the first drag do nothing.
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;

      const dx = e.clientX - dragInfo.current.startX;
      const dy = e.clientY - dragInfo.current.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragInfo.current.moved = true;

      const fracX = dx / rect.width;
      const fracY = dy / rect.height;
      const max = (zoom - 1) / 2;

      const newX = clamp(dragInfo.current.startPos.x + fracX, max);
      const newY = clamp(dragInfo.current.startPos.y + fracY, max);

      updatePersonalInfo({ photoPosition: { x: newX, y: newY } });
    },
    [zoom, updatePersonalInfo],
  );

  const handleMouseUp = useCallback(() => {
    const wasDrag = dragInfo.current?.moved;
    window.removeEventListener("mousemove", handleMouseMove);
    dragInfo.current = null;
    // A click without dragging opens the file picker.
    if (!wasDrag) inputRef.current?.click();
  }, [handleMouseMove]);

  if (!resume) return null;

  const { personalInfo } = resume;

  const position = personalInfo.photoPosition ?? { x: 0, y: 0 };

  const openFilePicker = () => inputRef.current?.click();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const photo = await uploadProfilePhoto(file);
      updatePersonalInfo({
        photo: photo.url,
        photoZoom: 1,
        photoPosition: { x: 0, y: 0 },
      });
    } catch (err) {
      console.error(err);
      alert("Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!personalInfo.photo) return;
    e.preventDefault();
    dragInfo.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: position,
      moved: false,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!personalInfo.photo) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
    const max = (newZoom - 1) / 2;
    updatePersonalInfo({
      photoZoom: newZoom,
      photoPosition: { x: clamp(position.x, max), y: clamp(position.y, max) },
    });
  };

  const skillCategories = resume.skills ?? [];
  const languages = resume.languages ?? [];

  return (
    <aside className={`${T.sidebar.width} ${T.sidebar.bg} ${T.sidebar.padding}`}>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePhotoUpload}
      />

      <div className={T.sidebar.gap}>
        {/* Photo */}
        <div
          ref={boxRef}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          className={`group relative select-none ${T.photo.box}`}
          style={{ cursor: personalInfo.photo ? "move" : "pointer" }}
        >
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              draggable={false}
              className="absolute left-1/2 top-1/2 h-full w-full object-cover"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x * 100}%, ${position.y * 100}%) scale(${zoom})`,
              }}
            />
          ) : (
            <div
              onClick={openFilePicker}
              className="flex h-full w-full items-center justify-center"
            >
              <Camera className="text-slate-500" size={28} />
            </div>
          )}

          {personalInfo.photo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <span className="text-[9px] text-white text-center px-2">
                {uploading ? "Uploading..." : "Drag · Scroll to zoom"}
              </span>
            </div>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-2">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className={`flex items-center gap-2 ${T.fontSize.sidebarBody} ${T.colors.sidebarText} hover:underline break-all`}
            >
              <Mail size={12} className="shrink-0" color={T.iconColors.sidebar} />
              {personalInfo.email}
            </a>
          )}

          {personalInfo.phone && (
            <p
              className={`flex items-center gap-2 ${T.fontSize.sidebarBody} ${T.colors.sidebarText}`}
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <Phone size={12} className="shrink-0" color={T.iconColors.sidebar} />
              {personalInfo.phone}
            </p>
          )}

          {personalInfo.address && (
            <p
              className={`flex items-center gap-2 ${T.fontSize.sidebarBody} ${T.colors.sidebarText}`}
            >
              <MapPin size={12} className="shrink-0" color={T.iconColors.sidebar} />
              {personalInfo.address}
            </p>
          )}

          {personalInfo.linkedIn && (
            <a
              href={personalInfo.linkedIn}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 ${T.fontSize.sidebarBody} ${T.links.default}`}
            >
              <FaLinkedin size={12} className="shrink-0" color={T.iconColors.sidebar} />
              LinkedIn
            </a>
          )}

          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 ${T.fontSize.sidebarBody} ${T.links.default}`}
            >
              <FaGithub size={12} className="shrink-0" color={T.iconColors.sidebar} />
              GitHub
            </a>
          )}

          {personalInfo.portfolio && (
            <a
              href={personalInfo.portfolio}
              target="_blank"
              rel="noreferrer"
              className={`${T.fontSize.sidebarBody} ${T.links.default}`}
            >
              {personalInfo.portfolio.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>

        {/* Skills — plain, no accent color per the "not on skills" requirement */}
        {skillCategories.length > 0 && (
          <div>
            <h3
              className={`${T.fontSize.sidebarLabel} ${T.fontWeight.bold} ${T.colors.sidebarHeading} uppercase tracking-wide mb-2`}
            >
              Skills
            </h3>
            <div className="space-y-2">
              {skillCategories.map((category, index) => (
                <div key={index}>
                  {category.title && (
                    <p
                      className={`${T.fontSize.sidebarLabel} ${T.fontWeight.semibold} ${T.colors.sidebarHeading} mb-1`}
                    >
                      {category.title}
                    </p>
                  )}
                  <div>
                    {category.skills.map((skill, i) => (
                      <span key={i} className={T.skills.tag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div>
            <h3
              className={`${T.fontSize.sidebarLabel} ${T.fontWeight.bold} ${T.colors.sidebarHeading} uppercase tracking-wide mb-2`}
            >
              Languages
            </h3>
            <div className="space-y-1.5">
              {languages.map((lang, index) => (
                <div key={index} className={T.languages.row}>
                  <span className={T.languages.name}>{lang.name}</span>
                  <span className={T.languages.level}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
