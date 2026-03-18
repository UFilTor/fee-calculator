import html2canvas from "html2canvas";

interface Props {
  targetRef: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButton({ targetRef }: Props) {
  const handleExport = async () => {
    if (!targetRef.current) return;

    const canvas = await html2canvas(targetRef.current, {
      backgroundColor: "#fafafa",
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "fee-comparison.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-lg bg-understory px-4 py-2 text-sm font-medium text-white hover:bg-understory-dark transition-colors cursor-pointer print:hidden"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export as PNG
    </button>
  );
}
