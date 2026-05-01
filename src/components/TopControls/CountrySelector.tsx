import type { CountryCode } from "../../types";
import { countries } from "../../config/fees";

const countryOrder: CountryCode[] = ["SE", "NO", "DK", "IT"];

interface Props {
  selected: CountryCode;
  onChange: (code: CountryCode) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  // Roving tabindex pattern: only the active radio is in the tab order;
  // arrow keys move both focus and selection between options.
  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    const last = countryOrder.length - 1;
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = idx === 0 ? last : idx - 1;
    else return;
    e.preventDefault();
    const code = countryOrder[next];
    onChange(code);
    document.getElementById(`country-${code}`)?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Select country" className="flex flex-wrap gap-2">
      {countryOrder.map((code, idx) => {
        const country = countries[code];
        const isSelected = selected === code;
        return (
          <button
            key={code}
            id={`country-${code}`}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className="country-pill"
            onClick={() => onChange(code)}
            onKeyDown={(e) => handleKey(e, idx)}
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
