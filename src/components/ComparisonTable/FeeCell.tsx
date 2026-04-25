import type { Country, FeeStructure } from "../../types";
import { formatCurrency, formatFeeBreakdown } from "../../utils/formatting";

interface Props {
  fee: number | null;
  country: Country;
  breakdown: FeeStructure | null;
  variant: "understory" | "stripe";
}

export default function FeeCell({ fee, country, breakdown, variant }: Props) {
  if (fee === null || breakdown === null) {
    return (
      <div
        style={{
          fontSize: 13,
          color: "var(--color-muted)",
          fontStyle: "italic",
          textAlign: "right",
        }}
      >
        Not available
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 2,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          lineHeight: 1,
          color:
            variant === "understory"
              ? "var(--color-moss)"
              : "var(--color-ink)",
          opacity: variant === "stripe" ? 0.75 : 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.01em",
        }}
      >
        {formatCurrency(fee, country)}
      </span>
      <span
        style={{
          fontSize: 11,
          color: "var(--color-muted)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatFeeBreakdown(breakdown.percentage, breakdown.fixedFee, country.currencySymbol)}
      </span>
    </div>
  );
}
