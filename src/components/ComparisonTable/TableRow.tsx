import type { CalculatedRow, Country } from "../../types";
import FeeCell from "./FeeCell";
import SavingsBadge from "./SavingsBadge";
import MethodIcon from "./MethodIcon";

interface Props {
  row: CalculatedRow;
  country: Country;
  isLast?: boolean;
}

export default function TableRow({ row, country }: Props) {
  const { method, understoryFee, stripeFee, savingsPercent } = row;
  const countryFees = method.fees[country.code]!;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.7fr) minmax(0, 1fr) minmax(0, 1fr) 64px",
        alignItems: "center",
        gap: 18,
        padding: "12px 4px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
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
      <FeeCell
        fee={understoryFee}
        country={country}
        breakdown={countryFees.understory}
        variant="understory"
      />
      <FeeCell
        fee={stripeFee}
        country={country}
        breakdown={countryFees.stripe}
        variant="stripe"
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {savingsPercent !== null && <SavingsBadge percent={savingsPercent} />}
      </div>
    </div>
  );
}
