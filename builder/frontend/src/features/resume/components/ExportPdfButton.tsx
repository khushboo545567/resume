import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function ExportPdfButton() {
  /*
   * Styled to match the other compact header action buttons
   * (e.g. "Analyze ATS") exactly — same height, padding, font size
   * and radius — at every breakpoint. Previously this used the
   * shared <Button> component's default (much larger) size and had
   * to be visually shrunk with a `transform: scale()` hack in
   * EditorHeader, which made it look subtly off (blurry edges,
   * mismatched spacing) compared to its neighbors. Rendering it at
   * its natural, correctly-sized style removes the need for that
   * hack entirely.
   */
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    console.log("Export Clicked");

    const element = document.getElementById("resume-export");

    if (!element) {
      alert("Resume preview not found");
      return;
    }

    setIsExporting(true);

    try {
      /*
       * Load the heavy PDF libraries only when the user clicks
       * "Download PDF", so they are not part of the initial bundle.
       */
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
      ]);

      /*
       * ============================================================
       * A4
       * ============================================================
       */

      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;

      /*
       * ============================================================
       * WAIT FOR RENDER
       * ============================================================
       */

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      /*
       * ============================================================
       * GET LINKS
       * ============================================================
       */

      const links = Array.from(
        element.querySelectorAll("a[href]"),
      ) as HTMLAnchorElement[];

      console.log("PDF Links Found:", links.length);

      /*
       * ============================================================
       * SAVE ELEMENT POSITION
       * ============================================================
       */

      const elementRect = element.getBoundingClientRect();

      /*
       * ============================================================
       * CAPTURE RESUME
       *
       * IMPORTANT:
       * NO onclone
       * NO parent transform changes
       * NO width/height override
       *
       * This keeps the same capture method
       * that was already generating your PDF.
       * ============================================================
       */

      const canvas = await html2canvas(element, {
        scale: 2,

        useCORS: true,

        backgroundColor: "#ffffff",

        logging: false,

        scrollX: 0,

        scrollY: 0,
      });

      console.log("Canvas:", {
        width: canvas.width,
        height: canvas.height,
      });

      /*
       * ============================================================
       * CREATE A4 PDF
       * ============================================================
       */

      const pdf = new jsPDF({
        orientation: "portrait",

        unit: "mm",

        format: "a4",

        compress: true,
      });

      /*
       * ============================================================
       * IMAGE
       * ============================================================
       */

      const imageData = canvas.toDataURL("image/jpeg", 0.98);

      /*
       * ============================================================
       * FIT RESUME INTO ONE A4 PAGE
       * ============================================================
       */

      const imageWidth = A4_WIDTH;

      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      /*
       * If content is taller than A4,
       * scale it down proportionally.
       */

      const scale = imageHeight > A4_HEIGHT ? A4_HEIGHT / imageHeight : 1;

      const finalWidth = imageWidth * scale;

      const finalHeight = imageHeight * scale;

      /*
       * Center on A4
       */

      const x = (A4_WIDTH - finalWidth) / 2;

      const y = (A4_HEIGHT - finalHeight) / 2;

      pdf.addImage(
        imageData,
        "JPEG",
        x,
        y,
        finalWidth,
        finalHeight,
        undefined,
        "FAST",
      );

      /*
       * ============================================================
       * CLICKABLE LINKS
       * ============================================================
       */

      /*
       * CSS pixel → PDF mm
       */

      const pixelToMm = finalWidth / element.offsetWidth;

      links.forEach((link) => {
        const href = link.href;

        if (!href) return;

        const rect = link.getBoundingClientRect();

        /*
         * Position relative to resume
         */

        const relativeX = rect.left - elementRect.left;

        const relativeY = rect.top - elementRect.top;

        /*
         * Convert to PDF coordinates
         */

        const linkX = x + relativeX * pixelToMm;

        const linkY = y + relativeY * pixelToMm;

        const linkWidth = rect.width * pixelToMm;

        const linkHeight = rect.height * pixelToMm;

        /*
         * Ignore invalid links
         */

        if (linkWidth <= 0 || linkHeight <= 0) {
          return;
        }

        /*
         * Keep link inside PDF page
         */

        if (linkX < 0 || linkY < 0 || linkX >= A4_WIDTH || linkY >= A4_HEIGHT) {
          return;
        }

        const safeWidth = Math.min(linkWidth, A4_WIDTH - linkX);

        const safeHeight = Math.min(linkHeight, A4_HEIGHT - linkY);

        if (safeWidth <= 0 || safeHeight <= 0) {
          return;
        }

        console.log("PDF Link:", href, {
          x: linkX,
          y: linkY,
          width: safeWidth,
          height: safeHeight,
        });

        pdf.link(linkX, linkY, safeWidth, safeHeight, {
          url: href,
        });
      });

      /*
       * ============================================================
       * SAVE
       * ============================================================
       */

      pdf.save("resume.pdf");

      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("PDF Export Error:", error);

      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 rounded-lg bg-btn px-3 py-1.5 text-xs font-semibold text-btn-text transition hover:bg-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isExporting ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Download size={13} />
      )}
      Download PDF
    </button>
  );
}
