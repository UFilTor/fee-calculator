import { useState, useEffect } from "react";
import type { Country } from "../../types";

interface Props {
  value: number;
  onChange: (value: number) => void;
  country: Country;
}

export default function BookingAmountInput({ value, onChange, country }: Props) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    setDisplay(String(value));
  }, [value]);

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="booking-amount" className="text-sm font-medium text-gray-600 whitespace-nowrap">
        Booking amount
      </label>
      <div className="flex items-center">
        <input
          id="booking-amount"
          type="number"
          min={1}
          value={display}
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
          className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-900 focus:border-understory focus:outline-none focus:ring-1 focus:ring-understory"
        />
        <span className="ml-2 text-sm text-gray-500">{country.currency}</span>
      </div>
    </div>
  );
}
