import html2pdf from "html2pdf.js";

interface ResumePdfOptions {
  margin?: number | [number, number, number, number];
  filename?: string;

  image?: {
    type?: "jpeg" | "png" | "webp";
    quality?: number;
  };

  html2canvas?: {
    scale?: number;
    useCORS?: boolean;
    backgroundColor?: string;
    letterRendering?: boolean;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
  };

  jsPDF?: {
    unit?: string;
    format?: string;
    orientation?: string;
    compress?: boolean;
  };

  pagebreak?: {
    mode?: string[];
  };
}

export const exportResumePdf = async (
  element: HTMLElement,
  fileName: string = "resume",
) => {
  if (!element) {
    console.error("No element provided for PDF export");
    return;
  }

  /*
   * Make sure the complete resume is available for html2canvas.
   * We intentionally do NOT change the live preview styling.
   */
  const originalOverflow = element.style.overflow;
  const originalHeight = element.style.height;
  const originalMaxHeight = element.style.maxHeight;

  try {
    element.style.overflow = "visible";
    element.style.height = "auto";
    element.style.maxHeight = "none";

    /*
     * Allow browser to finish layout before PDF generation.
     */
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });

    const elementRect = element.getBoundingClientRect();

    const links = Array.from(
      element.querySelectorAll("a[href]"),
    ) as HTMLAnchorElement[];

    const options: ResumePdfOptions = {
      margin: [10, 10, 10, 10],

      filename: `${fileName}.pdf`,

      image: {
        type: "jpeg",
        quality: 0.98,
      },

      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        letterRendering: true,

        /*
         * Capture the complete element instead of the
         * current viewport.
         */
        scrollX: 0,
        scrollY: 0,
        windowWidth: Math.max(
          document.documentElement.scrollWidth,
          element.scrollWidth,
          window.innerWidth,
        ),
        windowHeight: Math.max(
          document.documentElement.scrollHeight,
          element.scrollHeight,
          window.innerHeight,
        ),
      },

      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },

      /*
       * IMPORTANT:
       *
       * Do NOT use "avoid-all".
       *
       * Let html2pdf naturally create additional A4 pages.
       */
      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    const worker = html2pdf()
      .set(options as any)
      .from(element);

    /*
     * Generate PDF first.
     */
    await worker.toPdf();

    const pdf: any = await worker.get("pdf");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    /*
     * Link overlay
     *
     * NOTE:
     * We only add links when the link is inside the first
     * page area. html2pdf itself handles the visual content
     * across multiple pages.
     */
    const marginLeft = 10;
    const marginTop = 10;

    const contentWidth = pageWidth - marginLeft * 2;

    const sourceWidth =
      element.scrollWidth || element.offsetWidth;

    const scaleFactor =
      contentWidth / sourceWidth;

    links.forEach((linkEl) => {
      const rect = linkEl.getBoundingClientRect();

      const relativeLeft =
        rect.left - elementRect.left;

      const relativeTop =
        rect.top - elementRect.top;

      const x =
        marginLeft +
        relativeLeft * scaleFactor;

      const y =
        marginTop +
        relativeTop * scaleFactor;

      const w = rect.width * scaleFactor;

      const h = rect.height * scaleFactor;

      /*
       * Only add the link if its position is valid.
       *
       * This prevents broken links from being added
       * outside the PDF page.
       */
      if (
        x >= 0 &&
        y >= 0 &&
        x < pageWidth &&
        y < pageHeight
      ) {
        try {
          pdf.link(
            x,
            y,
            Math.min(w, pageWidth - x),
            Math.min(h, pageHeight - y),
            {
              url: linkEl.href,
            },
          );
        } catch (error) {
          console.warn(
            "Could not add PDF link:",
            linkEl.href,
            error,
          );
        }
      }
    });

    /*
     * Finally save PDF.
     */
    await pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("PDF export error:", error);
  } finally {
    /*
     * Restore live preview styles.
     */
    element.style.overflow = originalOverflow;
    element.style.height = originalHeight;
    element.style.maxHeight = originalMaxHeight;
  }
};