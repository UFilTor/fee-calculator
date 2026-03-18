import type { CountryCode } from "../../types";
import { countries } from "../../config/fees";

const countryOrder: CountryCode[] = ["SE", "NO", "DK", "IT"];

interface Props {
  selected: CountryCode;
  onChange: (code: CountryCode) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Select country" className="flex gap-2 sm:ml-auto shrink-0">
      {countryOrder.map((code) => {
        const country = countries[code];
        const isSelected = selected === code;
        return (
          <button
            key={code}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(code)}
            title={country.label}
            className={`inline-flex items-center justify-center rounded-full w-9 h-9 text-lg transition-colors cursor-pointer ${
              isSelected
                ? "bg-understory text-white ring-2 ring-understory ring-offset-2"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{country.flag}</span>
          </button>
        );
      })}
    </div>
  );
}
