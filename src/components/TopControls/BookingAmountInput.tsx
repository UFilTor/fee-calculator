import { useState } from "react";
import type { Country } from "../../types";

interface Props {
  value: number;
  onChange: (value: number) => void;
  country: Country;
}

export default function BookingAmountInput({ value, onChange, country }: Props) {
  const [display, setDisplay] = useState(String(value));
  const [prevValue, setPrevValue] = useState(value);

  // Adjust during render when the parent's value changes (e.g. country
  // switch resets the booking amount). Convergent: only fires when input
  // and synced display diverge.
  if (prevValue !== value) {
    setPrevValue(value);
    setDisplay(String(value));
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, minWidth: 0 }}>
      <label
        htmlFor="booking-amount"
        className="u-label"
        style={{ color: "var(--color-muted)" }}
      >
        Booking amount
      </label>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <input
          id="booking-amount"
          type="number"
          min={1}
          value={display}
          className="amount-input"
          onChange={(e) => {
            setDisplay(e.target.value);
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v > 0) onChange(v);
          }}
          onBlur={() => {
            if (!display || parseInt(display, 10) <= 0) {
              setDisplay(String(value));
            }
          }}
          style={{
            width: 110,
            fontFamily: "var(--font-display)",
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.01em",
            color: "var(--color-moss)",
            border: "none",
            background: "transparent",
            padding: "2px 0",
            textAlign: "left",
            fontVariantNumeric: "tabular-nums",
          }}
        />
        <span
          style={{
            fontSize: 14,
            color: "var(--color-muted)",
            fontWeight: 500,
          }}
        >
          {country.currency}
        </span>
      </div>
    </div>
  );
}
