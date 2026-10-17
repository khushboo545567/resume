import { useRef, useState, useCallback } from "react";

import { useResumeStore } from "../../../../../../store/resume.store";

import { FaEnvelope, FaPhone, FaLocationDot, FaGlobe } from "react-icons/fa6";

import { FaGithub, FaLinkedin, FaCamera } from "react-icons/fa";

import { uploadProfilePhoto } from "../../../../../../services/upload.service";

// Strips protocol/www for clean display
function formatUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

// Ensures link has protocol before opening (in case old data has no https://)
function ensureProtocol(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

const PHOTO_SIZE = 160;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

const clamp = (val: number, max: number) =>
  Math.max(-max, Math.min(max, val));

export default function HeaderPreview() {
  const resume = useResumeStore((state) => state.resume);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);

  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  // tracks whether the mouse actually moved (drag) vs a plain click
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

      const fracX = dx / PHOTO_SIZE;
      const fracY = dy / PHOTO_SIZE;
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

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const photo = await uploadProfilePhoto(file);
      // reset zoom/position for the new photo
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

  // DRAG TO PAN
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!personalInfo.photo) return; // no photo yet → click just opens picker
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

  // SCROLL TO ZOOM
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
    <header className="overflow-hidden rounded-xl bg-[#0F2345] text-white shadow-lg">
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePhotoUpload}
      />

      {/* ================= TOP ================= */}
      {/* ================= TOP ================= */}
      <div className="flex items-center justify-between gap-8 px-10 py-5">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-[32px] font-extrabold uppercase tracking-wide leading-tight">
            {personalInfo.fullName}
          </h1>

          <h2 className="mt-1 text-[15px] font-bold tracking-wide text-[#63A5FF] uppercase">
            {personalInfo.title}
          </h2>

          {/* {summary && (
            <p className="mt-3 max-w-[520px] text-[12.5px] leading-6 text-slate-300">
              {summary}
            </p>
          )} */}

          {/* Contact */}
          <div className="mt-5 flex flex-nowrap items-center gap-x-4 gap-y-2 text-[12px] whitespace-nowrap">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[13px] text-slate-200" />
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:underline"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <FaPhone className="text-[13px] text-slate-200" />
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="hover:underline"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}

            {personalInfo.address && (
              <div className="flex items-center gap-2">
                <FaLocationDot className="text-[13px] text-slate-200" />
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* DIVIDER */}
        {/* DIVIDER */}
        <div className="hidden h-24 w-px shrink-0 bg-white/20 md:block" />
        {/* RIGHT — Photo */}
        {/* RIGHT — Photo */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            className="group relative select-none overflow-hidden rounded-full bg-[#0F2345] ring-2 ring-white/30"
            style={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              cursor: personalInfo.photo ? "move" : "pointer",
            }}
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                draggable={false}
                className="absolute left-1/2 top-1/2 h-full w-full object-contain"
                style={{
                  transform: `translate(-50%, -50%) translate(${position.x * PHOTO_SIZE}px, ${position.y * PHOTO_SIZE}px) scale(${zoom})`,
                }}
              />
            ) : (
              <div
                onClick={openFilePicker}
                className="flex h-full w-full items-center justify-center bg-slate-700"
              >
                <FaCamera className="text-3xl text-white" />
              </div>
            )}

            {personalInfo.photo && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100">
                {uploading ? (
                  <span className="text-xs font-medium text-white">
                    Uploading...
                  </span>
                ) : (
                  <div className="flex flex-col items-center text-white">
                    <FaCamera className="text-lg" />
                    <span className="mt-1 text-[10px]">
                      Drag to move · Scroll to zoom
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="flex flex-wrap items-center justify-start gap-6 border-t border-white/10 bg-[#0C1D3C] px-8 py-3 text-[12.5px]">
        {personalInfo.linkedIn && (
          <div className="flex items-center gap-2">
            <FaLinkedin className="text-[14px] text-[#63A5FF]" />
            <a
              href={ensureProtocol(personalInfo.linkedIn)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {formatUrl(personalInfo.linkedIn)}
            </a>
          </div>
        )}

        {personalInfo.github && (
          <div className="flex items-center gap-2">
            <FaGithub className="text-[14px] text-[#63A5FF]" />
            <a
              href={ensureProtocol(personalInfo.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {formatUrl(personalInfo.github)}
            </a>
          </div>
        )}

        {personalInfo.portfolio && (
          <div className="flex items-center gap-2">
            <FaGlobe className="text-[14px] text-[#63A5FF]" />
            <a
              href={ensureProtocol(personalInfo.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {formatUrl(personalInfo.portfolio)}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
