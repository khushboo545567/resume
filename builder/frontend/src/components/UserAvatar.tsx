import { useEffect, useState } from "react";

interface UserAvatarProps {
  src?: string | null;
  initial: string;
  className?: string;
}

/** Shows the user's photo, falling back to the initial if there is none or it fails to load. */
export default function UserAvatar({ src, initial, className = "" }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${className} object-cover`}
      />
    );
  }
  return <span className={className}>{initial}</span>;
}
