import {
  Component,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";

import { ResumeOverrideContext } from "../../../store/resume.store";
import { ResumeTemplatesMap } from "../preview/templates";
import { templates } from "../config/templates";
import TechnicalThumbnail from "../thumbnails/TechnicalThumbnail";

import type { Resume } from "../types/resume.types";

/*
 * Renders the REAL resume template, fed with this resume's own data via
 * ResumeOverrideContext, at full A4 size (794 x 1123) and scales it down with
 * a CSS transform. Only the first page is shown (clipped to 1123px).
 *
 * - The real template is mounted lazily, once the card is near the viewport,
 *   and then kept mounted.
 * - Until then (and if the template throws) a lightweight static fallback is
 *   shown: the template's screenshot, else the old TechnicalThumbnail.
 */

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const FALLBACK_TEMPLATE_ID = "technical-developer";
const VIEWPORT_MARGIN = "300px";

interface Props {
  resume: Resume;
}

/* ---------- error boundary ---------- */

class ThumbnailErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Resume thumbnail failed to render", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/* ---------- static fallback ---------- */

function StaticFallback({ resume }: Props) {
  const shot = templates.find((t) => t.id === resume.templateId)?.image;

  if (shot) {
    return (
      <img
        src={shot}
        alt=""
        aria-hidden="true"
        draggable={false}
        loading="lazy"
        className="pointer-events-none h-full max-w-full select-none rounded bg-white object-contain object-top shadow"
      />
    );
  }

  return <TechnicalThumbnail resume={resume} />;
}

/* ---------- live template ---------- */

function LiveTemplate({ resume, scale }: Props & { scale: number }) {
  const Template =
    ResumeTemplatesMap[resume.templateId as keyof typeof ResumeTemplatesMap] ||
    ResumeTemplatesMap[FALLBACK_TEMPLATE_ID];

  return (
    <div
      className="shrink-0 overflow-hidden rounded bg-white shadow"
      style={{
        width: A4_WIDTH_PX * scale,
        height: A4_HEIGHT_PX * scale,
      }}
    >
      <div
        className="relative overflow-hidden bg-white font-sans"
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumeOverrideContext.Provider value={resume}>
          <Template />
        </ResumeOverrideContext.Provider>
      </div>
    </div>
  );
}

/* ---------- public component ---------- */

export default function LiveResumeThumbnail({ resume }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Without IntersectionObserver there is nothing to wait for: mount right away.
  const [nearViewport, setNearViewport] = useState(
    () => typeof IntersectionObserver === "undefined",
  );
  const [scale, setScale] = useState(0.22);

  // Mount the real template once, when the card gets close to the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || nearViewport) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: VIEWPORT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [nearViewport]);

  // Fit the A4 page inside the preview area (with a little breathing room).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth - 24;
      const h = el.clientHeight - 24;
      if (w <= 0 || h <= 0) return;
      setScale(Math.min(w / A4_WIDTH_PX, h / A4_HEIGHT_PX));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fallback = (
    <div
      className="flex items-center justify-center"
      style={{ height: A4_HEIGHT_PX * scale }}
    >
      <StaticFallback resume={resume} />
    </div>
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none flex h-full w-full select-none items-center justify-center overflow-hidden"
    >
      {nearViewport ? (
        <ThumbnailErrorBoundary fallback={fallback}>
          <LiveTemplate resume={resume} scale={scale} />
        </ThumbnailErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
