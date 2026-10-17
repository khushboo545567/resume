import { useRef, useState, useCallback } from "react";

import { useResumeStore } from "../../../../../../store/resume.store";
import { uploadProfilePhoto } from "../../../../../../services/upload.service";
import { FaCamera } from "react-icons/fa";

import { LatexATSPhotoTheme as T } from "../theme.latex-ats-photo";

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

const { width: PW, height: PH } = T.photo;

const clamp = (val: number, max: number) =>
  Math.max(-max, Math.min(max, val));

export default function HeaderPreview() {
  const resume = useResumeStore((state) => state.resume);
  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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
      const dx = e.clientX - dragInfo.current.startX;
      const dy = e.clientY - dragInfo.current.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragInfo.current.moved = true;

      const fracX = dx / PW;
      const fracY = dy / PH;
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

  return (
    <header className="w-full">
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePhotoUpload}
      />

      <div className="flex items-start justify-between gap-6">
        {/* LEFT — name + labeled contact lines, matches the two-minipage .tex layout */}
        <div className="flex-1 min-w-0">
          <h1
            className={`
              ${T.fontFamily.heading}
              ${T.fontSize.name}
              ${T.fontWeight.bold}
              ${T.lineHeight.heading}
              ${T.colors.heading}
              [font-variant:small-caps]
            `}
          >
            {personalInfo.fullName}
          </h1>

          <div
            className={`
              ${T.fontFamily.body}
              ${T.fontSize.contact}
              [font-variant-numeric:lining-nums]
              ${T.colors.body}
              mt-2 space-y-1
            `}
          >
            {personalInfo.phone && (
              <p>
                Phone:{" "}
                <span style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                  {personalInfo.phone}
                </span>
              </p>
            )}

            {personalInfo.email && (
              <p>
                Email:{" "}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="underline hover:no-underline break-all"
                >
                  {personalInfo.email}
                </a>
              </p>
            )}

            {personalInfo.linkedIn && (
              <p className="break-all">
                LinkedIn:{" "}
                <a
                  href={personalInfo.linkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:no-underline"
                >
                  {personalInfo.linkedIn}
                </a>
              </p>
            )}

            {personalInfo.github && (
              <p className="break-all">
                Github:{" "}
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:no-underline"
                >
                  {personalInfo.github}
                </a>
              </p>
            )}

            {personalInfo.portfolio && (
              <p className="break-all">
                Portfolio:{" "}
                <a
                  href={personalInfo.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:no-underline"
                >
                  {personalInfo.portfolio}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — portrait photo box, drag to pan / scroll to zoom */}
        <div
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          className={`group relative select-none shrink-0 ${T.photo.box}`}
          style={{
            width: PW,
            height: PH,
            cursor: personalInfo.photo ? "move" : "pointer",
          }}
        >
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              draggable={false}
              className="absolute left-1/2 top-1/2 h-full w-full object-cover"
              style={{
                transform: `translate(-50%, -50%) translate(${position.x * PW}px, ${position.y * PH}px) scale(${zoom})`,
              }}
            />
          ) : (
            <div
              onClick={openFilePicker}
              className="flex h-full w-full items-center justify-center bg-slate-200"
            >
              <FaCamera className="text-2xl text-slate-500" />
            </div>
          )}

          {personalInfo.photo && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100">
              {uploading ? (
                <span className="text-[10px] font-medium text-white">
                  Uploading...
                </span>
              ) : (
                <div className="flex flex-col items-center text-white text-center px-1">
                  <FaCamera className="text-sm" />
                  <span className="mt-1 text-[9px]">Drag · Scroll to zoom</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${T.divider.header} w-full`} />
    </header>
  );
}
