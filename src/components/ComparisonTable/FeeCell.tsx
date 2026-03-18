import type { Country, FeeStructure } from "../../types";
import { formatCurrency } from "../../utils/formatting";

interface Props {
  fee: number;
  country: Country;
  breakdown: FeeStructure;
  bookingAmount: number;
  variant: "understory" | "stripe";
}

export default function FeeCell({ fee, country, breakdown, bookingAmount, variant }: Props) {
  const tooltipText = `${breakdown.percentage}% × ${bookingAmount} ${country.currencySymbol} + ${breakdown.fixedFee} ${country.currencySymbol} = ${formatCurrency(fee, country)}`;

  return (
    <div className="group relative inline-block">
      <button
        type="button"
        tabIndex={0}
        className={`text-sm font-semibold cursor-default focus:outline-none tabular-nums transition-opacity duration-200 ${
          variant === "understory" ? "text-understory" : "text-gray-700"
        }`}
      >
        {formatCurrency(fee, country)}
      </button>
      <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-max max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block group-focus-within:block z-10">
        {tooltipText}
        <div className="absolute top-full right-4 h-0 w-0 border-x-4 border-t-4 border-x-transparent border-t-gray-900" />
      </div>
    </div>
  );
}
