import type { CountryCode } from "../../types";
import { countries } from "../../config/fees";

const countryOrder: CountryCode[] = ["SE", "NO", "DK", "IT"];

interface Props {
  selected: CountryCode;
  onChange: (code: CountryCode) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Select country" className="flex flex-wrap gap-2">
      {countryOrder.map((code) => {
        const country = countries[code];
        const isSelected = selected === code;
        return (
          <button
            key={code}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(code)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              border: isSelected
                ? "1px solid var(--color-moss)"
                : "1px solid var(--border)",
              background: isSelected ? "var(--color-moss)" : "var(--color-off-white)",
              color: isSelected ? "var(--color-light-grey)" : "var(--color-ink)",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background .12s, color .12s, border-color .12s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 15, lineHeight: 1 }}>{country.flag}</span>
            <span>{country.label}</span>
          </button>
        );
      })}
    </div>
  );
}
