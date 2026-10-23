import { forwardRef, useRef, useEffect, useState } from "react";
import TemplateRenderer from "../../preview/templates/TemplateRenderer";

/*
 * ============================================================
 * A4 CONFIGURATION
 * ============================================================
 *
 * Actual A4 at 96 dpi ≈ 794 × 1123 px.
 * We render the resume at full A4 resolution and then scale
 * it down so it fits the available panel width.
 */

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/*
 * ============================================================
 * PREVIEW PANEL
 * ============================================================
 *
 * Two contexts:
 *  - Desktop (md+): always visible, docked to the right. Fixed pixel
 *    widths at md (320px) and xl+ (384px, 500px from 2xl), but a
 *    percentage width (42%) in the 1024–1279px band specifically —
 *    that's the range where the sections sidebar floats as an
 *    overlay instead of taking layout space (see EditorSidebar), so
 *    without a percentage share here the form would grow to fill
 *    nearly the whole row and dwarf a fixed-width preview.
 *  - Mobile/tablet (< md): shown full-width when the "Preview"
 *    tab is active, hidden otherwise.
 *
 * When not the active mobile tab, this is kept off-screen with
 * opacity/pointer-events rather than `display:none` so it stays
 * laid out (needed by ResizeObserver / general rendering) even
 * while visually hidden.
 *
 * PDF EXPORT NODE
 * ----------------
 * The on-screen page above is scaled with a CSS `transform: scale()`
 * so it fits the panel at any screen width. html2canvas does not
 * reliably capture an element that sits inside a scaled ancestor —
 * depending on the current scale factor it can shrink, blur or
 * duplicate/overlap the rendered text.
 *
 * To make export scale-independent, we render a second, completely
 * separate copy of the resume at full, untransformed A4 size
 * (`#resume-export`), positioned off-screen with `position: fixed`.
 * It is never inside any transformed ancestor, so html2canvas always
 * captures the same pixel-perfect page regardless of viewport width
 * or the live-preview zoom level.
 */

interface Props {
  mobileVisible: boolean;
}

const PreviewPanel = forwardRef<HTMLElement, Props>(
  ({ mobileVisible }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    /*
     * Compute scale whenever the container resizes.
     * We leave 32 px of horizontal padding (16 px each side).
     */
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const compute = () => {
        const available = el.clientWidth - 32; // 16px padding each side
        const s = Math.min(available / A4_WIDTH_PX, 1); // never upscale
        setScale(s);
      };

      compute();

      const ro = new ResizeObserver(compute);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    /*
     * The visual bounding box for the scaled page.
     * transform-origin is "top center", so we need to account
     * for the height shrinkage caused by scale.
     */
    const scaledHeight = A4_HEIGHT_PX * scale;

    return (
      <>
      <aside
        ref={ref}
        className={`flex h-full flex-col w-full [@media(min-width:768px)_and_(max-width:1023px)]:w-80 [@media(min-width:1024px)_and_(max-width:1279px)]:w-[42%] xl:w-96 2xl:w-125 bg-background md:border-l border-border ${
          mobileVisible
            ? "static opacity-100 pointer-events-auto"
            : "absolute inset-0 -z-10 opacity-0 pointer-events-none"
        } md:static md:z-auto md:opacity-100 md:pointer-events-auto`}
        style={{ minWidth: 0 }}
      >
        {/* ── Header ────────────────────────────────────── */}
        <div className="shrink-0 h-14 bg-navbar border-b border-border-navbar px-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-heading">Live Preview</h2>
          <div className="flex items-center gap-2 text-xs text-heading/50">
            <span>A4</span>
            <span className="h-3 w-px bg-btn/20" />
            <span className="font-medium text-green-700">
              {Math.round(scale * 100)}%
            </span>
          </div>
        </div>

        {/* ── Preview area ──────────────────────────────── */}
        <div
          ref={containerRef}
          className="flex-1 min-h-0 overflow-y-auto py-5 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          {/*
           * Outer wrapper: reserves the visual height of the scaled page
           * and centers it horizontally.
           */}
          <div
            className="mx-auto relative"
            style={{
              width: `${A4_WIDTH_PX * scale}px`,
              height: `${scaledHeight}px`,
            }}
          >
            {/*
             * Inner wrapper: rendered at full A4 size, then scaled down.
             * transform-origin "top left" means the top-left corner
             * stays pinned, which matches our wrapper sizing above.
             */}
            <div
              style={{
                width: `${A4_WIDTH_PX}px`,
                height: `${A4_HEIGHT_PX}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {/*
               * Visual-only A4 page. Not used for export — see
               * #resume-export below.
               */}
              <div
                className="relative overflow-hidden bg-popup shadow-xl font-sans"
                style={{
                  width: `${A4_WIDTH_PX}px`,
                  height: `${A4_HEIGHT_PX}px`,
                  minWidth: `${A4_WIDTH_PX}px`,
                  maxWidth: `${A4_WIDTH_PX}px`,
                  minHeight: `${A4_HEIGHT_PX}px`,
                  maxHeight: `${A4_HEIGHT_PX}px`,
                }}
              >
                <TemplateRenderer />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────── */}
        <div className="shrink-0 h-10 bg-navbar border-t border-border-navbar px-4 flex items-center justify-between text-xs text-heading/50">
          <span>A4 Live Preview</span>
          <span className="font-medium text-green-700">Ready for Export</span>
        </div>
      </aside>

      {/*
       * ── PDF export node ────────────────────────────────
       * Full-resolution, untransformed A4 page kept off-screen.
       * Deliberately NOT nested inside the scaled preview above so
       * html2canvas never has to deal with an ancestor `transform`.
       * `position: fixed` + a large negative `left` keeps it out of
       * the viewport without `display: none` (which html2canvas
       * cannot capture).
       */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-10000px",
          width: `${A4_WIDTH_PX}px`,
          height: `${A4_HEIGHT_PX}px`,
          pointerEvents: "none",
        }}
      >
        <div
          id="resume-export"
          className="relative overflow-hidden bg-popup font-sans"
          style={{
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            minWidth: `${A4_WIDTH_PX}px`,
            maxWidth: `${A4_WIDTH_PX}px`,
            minHeight: `${A4_HEIGHT_PX}px`,
            maxHeight: `${A4_HEIGHT_PX}px`,
          }}
        >
          <TemplateRenderer />
        </div>
      </div>
      </>
    );
  },
);

PreviewPanel.displayName = "PreviewPanel";

export default PreviewPanel;
