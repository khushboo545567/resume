import { useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { useResumeStore } from "../store/resume.store";
import { uploadProfilePhoto } from "../services/upload.service";

export default function ImageUploader() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const personalInfo = useResumeStore((state) => state.resume?.personalInfo);

  const updatePersonalInfo = useResumeStore(
    (state) => state.updatePersonalInfo,
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);

      const photo = await uploadProfilePhoto(file);

      updatePersonalInfo({
        photo: photo.url,
      });
    } catch (err) {
      console.error(err);
      alert("Photo upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp"
        onChange={handleUpload}
      />

      <div
        onClick={handleClick}
        className="
          relative
          h-32
          w-32
          cursor-pointer
          overflow-hidden
          rounded-full
          border-2
          border-border
          transition
          hover:border-border-strong
        "
      >
        {personalInfo?.photo ? (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-btn-hover-bg">
            <FaCamera className="text-3xl text-nav-text" />
          </div>
        )}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-black/40
            opacity-0
            transition
            hover:opacity-100
          "
        >
          {loading ? (
            <span className="text-sm text-white">Uploading...</span>
          ) : (
            <FaCamera className="text-2xl text-white" />
          )}
        </div>
      </div>
    </>
  );
}
