import type { CalculatedRow, Country } from "../../types";
import FeeCell from "./FeeCell";
import SavingsBadge from "./SavingsBadge";
import MethodIcon from "./MethodIcon";

interface Props {
  row: CalculatedRow;
  country: Country;
}

export default function TableRow({ row, country }: Props) {
  const { method, understoryFee, stripeFee, savingsPercent } = row;
  const countryFees = method.fees[country.code]!;

  return (
    <div className="fee-row">
      <div
        className="fee-method"
        style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}
      >
        <MethodIcon icon={method.icon} size={36} />
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 500,
              fontSize: 15,
              color: "var(--color-ink)",
              lineHeight: 1.25,
            }}
          >
            {method.label}
          </div>
          {method.sub && (
            <div
              style={{
                fontSize: 11,
                color: "var(--color-muted)",
                marginTop: 2,
              }}
            >
              {method.sub}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only labels (display:none on desktop). */}
      <div className="fee-cell-mobile-label u">Understory Pay</div>
      <div className="fee-cell-mobile-label s">Stripe</div>

      <div className="fee-cell u">
        <FeeCell
          fee={understoryFee}
          country={country}
          breakdown={countryFees.understory}
          variant="understory"
        />
      </div>
      <div className="fee-cell s">
        <FeeCell
          fee={stripeFee}
          country={country}
          breakdown={countryFees.stripe}
          variant="stripe"
        />
      </div>

      <div className="fee-badge" style={{ display: "flex", justifyContent: "flex-end" }}>
        {savingsPercent !== null && <SavingsBadge percent={savingsPercent} />}
      </div>
    </div>
  );
}
