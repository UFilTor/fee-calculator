import { toPng } from "html-to-image";
import { useState } from "react";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ targetRef }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current || exporting) return;
    setExporting(true);

    try {
      const el = targetRef.current;
      el.style.padding = "24px";

      // Hide elements marked for export exclusion
      const hidden = el.querySelectorAll<HTMLElement>("[data-export-hide]");
      hidden.forEach((h) => (h.style.display = "none"));

      const dataUrl = await toPng(el, {
        backgroundColor: "#fafafa",
        pixelRatio: 2,
      });

      el.style.padding = "";
      hidden.forEach((h) => (h.style.display = ""));

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "fee-comparison.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      targetRef.current.style.padding = "";
      targetRef.current.querySelectorAll<HTMLElement>("[data-export-hide]").forEach((h) => (h.style.display = ""));
      console.error("Export failed:", err);
      alert("Export failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 rounded-lg bg-understory px-4 py-2 text-sm font-medium text-white hover:bg-understory-dark transition-colors cursor-pointer print:hidden disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {exporting ? "Exporting..." : "Export as PNG"}
    </button>
  );
}
