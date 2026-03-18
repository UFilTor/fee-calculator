import type { CalculatedRow, Country } from "../../types";
import FeeCell from "./FeeCell";
import SavingsBadge from "./SavingsBadge";
import MethodIcon from "./MethodIcon";

interface Props {
  row: CalculatedRow;
  country: Country;
  bookingAmount: number;
}

export default function TableRow({ row, country, bookingAmount }: Props) {
  const { method, understoryFee, stripeFee, savingsPercent } = row;
  const countryFees = method.fees[country.code]!;

  const formatFee = (pct: number, fixed: number) =>
    fixed > 0 ? `${pct}% + ${fixed} ${country.currencySymbol}` : `${pct}%`;

  const understoryLabel = formatFee(countryFees.understory.percentage, countryFees.understory.fixedFee);
  const stripeLabel = countryFees.stripe
    ? formatFee(countryFees.stripe.percentage, countryFees.stripe.fixedFee)
    : null;

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <MethodIcon icon={method.icon} />
          <div>
            <div className="text-sm font-medium text-gray-900">{method.label}</div>
            <div className="text-xs text-gray-400">
              {understoryLabel}
              {stripeLabel && <span className="text-gray-300"> | </span>}
              {stripeLabel && <span>{stripeLabel}</span>}
            </div>
          </div>
        </div>
      </td>
      <td className="py-3 text-center">
        <FeeCell
          fee={understoryFee}
          country={country}
          breakdown={countryFees.understory}
          bookingAmount={bookingAmount}
          variant="understory"
        />
      </td>
      <td className="py-3 text-center">
        {stripeFee !== null ? (
          <FeeCell
            fee={stripeFee}
            country={country}
            breakdown={countryFees.stripe!}
            bookingAmount={bookingAmount}
            variant="stripe"
          />
        ) : (
          <span className="text-sm text-gray-400 italic">Not available</span>
        )}
      </td>
      <td className="py-3 text-center">
        {savingsPercent !== null && <SavingsBadge percent={savingsPercent} />}
      </td>
    </tr>
  );
}
