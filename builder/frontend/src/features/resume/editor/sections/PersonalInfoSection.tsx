// //   // Watch all form values

import { useEffect, useState, useRef, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { X, Pencil } from "lucide-react";

import { useResumeStore } from "../../../../store/resume.store";
import { uploadProfilePhoto } from "../../../../services/upload.service";
import SuggestInput from "../../../../components/ui/SuggestInput";
import { searchRoles } from "../../config/jobRoles";

export interface PersonalInfoFormData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  github: string;
  portfolio: string;
  photo: string;
}

const PHOTO_SIZE = 144; // px, matches h-36 w-36
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;

export default function PersonalInfoSection() {
  const resume = useResumeStore((state) => state.resume);

  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [photoError, setPhotoError] = useState<string>("");
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{
    startX: number;
    startY: number;
    startPos: { x: number; y: number };
    moved: boolean;
  } | null>(null);

  const zoom = resume?.personalInfo.photoZoom ?? 1;
  const position = resume?.personalInfo.photoPosition ?? { x: 0, y: 0 };

  const { register, reset, control } = useForm<PersonalInfoFormData>({
    defaultValues: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      linkedIn: "",
      github: "",
      portfolio: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (!resume) return;

    reset({
      fullName: resume.personalInfo.fullName ?? "",
      title: resume.personalInfo.title ?? "",
      email: resume.personalInfo.email ?? "",
      phone: resume.personalInfo.phone ?? "",
      address: resume.personalInfo.address ?? "",
      linkedIn: resume.personalInfo.linkedIn ?? "",
      github: resume.personalInfo.github ?? "",
      portfolio: resume.personalInfo.portfolio ?? "",
    });

    setPhotoPreview(resume.personalInfo.photo ?? "");
  }, [resume, reset]);

  const clamp = (val: number, max: number) => Math.max(-max, Math.min(max, val));

  // CREATE / UPDATE: handles both the first upload and replacing an existing photo
  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    // reset input value so re-selecting the same file still fires onChange
    e.target.value = "";
    if (!file) return;

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please upload an image file.");
      return;
    }

    // 2MB limit — adjust to whatever your backend / store expects
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 2MB.");
      return;
    }

    try {
      setPhotoUploading(true);
      // Upload to Cloudinary and store the returned URL, not a base64
      // data URI — a base64-encoded image easily exceeds the backend's
      // JSON body size limit and makes autosave fail with a 413.
      const photo = await uploadProfilePhoto(file);
      setPhotoPreview(photo.url);
      // reset zoom/position for the new photo
      updatePersonalInfo({
        photo: photo.url,
        photoZoom: 1,
        photoPosition: { x: 0, y: 0 },
      });
    } catch (err) {
      console.error(err);
      setPhotoError("Photo upload failed. Please try again.");
    } finally {
      setPhotoUploading(false);
    }
  };

  // DELETE
  const handleRemovePhoto = () => {
    setPhotoPreview("");
    setPhotoError("");
    updatePersonalInfo({ photo: "", photoZoom: 1, photoPosition: { x: 0, y: 0 } });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragInfo.current) return;
      const dx = e.clientX - dragInfo.current.startX;
      const dy = e.clientY - dragInfo.current.startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragInfo.current.moved = true;
      }

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
    window.removeEventListener("mousemove", handleMouseMove);
    dragInfo.current = null;
  }, [handleMouseMove]);

  // DRAG TO PAN
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!photoPreview) return;
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
    if (!photoPreview) return;
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
    const max = (newZoom - 1) / 2;

    updatePersonalInfo({
      photoZoom: newZoom,
      photoPosition: { x: clamp(position.x, max), y: clamp(position.y, max) },
    });
  };

  const handleZoomSlider = (val: number) => {
    const max = (val - 1) / 2;
    updatePersonalInfo({
      photoZoom: val,
      photoPosition: { x: clamp(position.x, max), y: clamp(position.y, max) },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="group relative h-36 w-36">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            className="h-36 w-36 select-none overflow-hidden rounded-full border-2 border-dashed border-border bg-btn-hover-bg"
            style={{ cursor: photoPreview ? "move" : "default" }}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile"
                draggable={false}
                className="relative left-1/2 top-1/2 h-full w-full object-contain"
                style={{
                  transform: `translate(-50%, -50%) translate(${position.x * PHOTO_SIZE}px, ${position.y * PHOTO_SIZE}px) scale(${zoom})`,
                }}
              />
            ) : (
              <label className="flex h-full w-full cursor-pointer items-center justify-center">
                <span className="text-sm text-nav-text">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>

          {photoPreview && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              {/* EDIT: reuses the same hidden input to replace the photo */}
              <label className="pointer-events-auto cursor-pointer rounded-full bg-popup p-2 hover:bg-btn-hover-bg">
                <Pencil className="h-4 w-4 text-heading/80" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>

              {/* DELETE */}
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="pointer-events-auto rounded-full bg-popup p-2 hover:bg-btn-hover-bg"
              >
                <X className="h-4 w-4 text-heading/80" />
              </button>
            </div>
          )}
        </div>

        {photoPreview && (
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            value={zoom}
            onChange={(e) => handleZoomSlider(parseFloat(e.target.value))}
            className="w-36 accent-[#4a3728]"
          />
        )}

        {photoUploading && (
          <p className="text-sm text-nav-text">Uploading photo…</p>
        )}

        {photoError && <p className="text-sm text-red-500">{photoError}</p>}
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <label className="font-medium">Full Name</label>

          <input
            {...register("fullName", {
              onChange: (e) =>
                updatePersonalInfo({
                  fullName: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="Hemendra Gour"
          />
        </div>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <SuggestInput
              label="Professional Title"
              placeholder="Frontend Developer"
              emptyHeading="Popular roles"
              name={field.name}
              value={field.value ?? ""}
              onChange={(value) => {
                field.onChange(value);
                updatePersonalInfo({ title: value });
              }}
              onBlur={field.onBlur}
              getSuggestions={searchRoles}
            />
          )}
        />

        <div>
          <label className="font-medium">Email</label>

          <input
            type="email"
            {...register("email", {
              onChange: (e) =>
                updatePersonalInfo({
                  email: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="hemendra@gmail.com"
          />
        </div>

        <div>
          <label className="font-medium">Phone</label>

          <input
            type="tel"
            {...register("phone", {
              onChange: (e) =>
                updatePersonalInfo({
                  phone: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="+91 9876543210"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-medium">Address</label>

          <input
            {...register("address", {
              onChange: (e) =>
                updatePersonalInfo({
                  address: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="Bhopal, India"
          />
        </div>

        <div>
          <label className="font-medium">LinkedIn</label>

          <input
            {...register("linkedIn", {
              onChange: (e) =>
                updatePersonalInfo({
                  linkedIn: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div>
          <label className="font-medium">GitHub</label>

          <input
            {...register("github", {
              onChange: (e) =>
                updatePersonalInfo({
                  github: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="https://github.com/..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="font-medium">Portfolio</label>

          <input
            type="url"
            {...register("portfolio", {
              onChange: (e) =>
                updatePersonalInfo({
                  portfolio: e.target.value,
                }),
            })}
            className="mt-2 h-12 w-full rounded-lg border border-border px-4"
            placeholder="https://portfolio.com"
          />
        </div>
      </div>
    </div>
  );
}