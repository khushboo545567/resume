interface BrandWordmarkProps {
  /** "dark" for light backgrounds (navbar), "light" for the dark sidebar. */
  tone?: "dark" | "light";
  className?: string;
}

/** The Throne8 wordmark, styled like the Throne8 web app: "Throne" + a gold "8". */
export default function BrandWordmark({
  tone = "dark",
  className = "",
}: BrandWordmarkProps) {
  const throne =
    tone === "light"
      ? "text-sidebar-text"
      : "bg-linear-to-b from-[#2d2116] to-[#5c4033] bg-clip-text text-transparent";

  return (
    <span
      aria-label="Throne8"
      className={`inline-flex select-none items-baseline font-black leading-none tracking-[-0.04em] ${className}`}
    >
      <span className={throne}>Throne</span>
      <span className="ml-px bg-linear-to-br from-[#e8c15a] via-[#c4963a] to-[#9f722d] bg-clip-text text-transparent">
        8
      </span>
    </span>
  );
}
