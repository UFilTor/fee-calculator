import type { CalculatedRow, Country } from "../../types";
import TableRow from "./TableRow";

interface Props {
  rows: CalculatedRow[];
  country: Country;
}

export default function ComparisonTable({ rows, country }: Props) {
  return (
    <div
      style={{
        background: "var(--color-off-white)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "4px 24px 8px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.7fr) minmax(0, 1fr) minmax(0, 1fr) 64px",
          gap: 18,
          padding: "10px 4px 6px",
          alignItems: "center",
        }}
      >
        <div className="u-label" style={{ color: "var(--color-muted)" }}>
          Payment method
        </div>
        <div
          className="u-label"
          style={{ color: "var(--color-moss)", textAlign: "right" }}
        >
          Understory Pay
        </div>
        <div
          className="u-label"
          style={{ color: "var(--color-muted)", textAlign: "right" }}
        >
          Stripe
        </div>
        <div />
      </div>
      {rows.map((row) => (
        <TableRow key={row.method.id} row={row} country={country} />
      ))}
    </div>
  );
}
