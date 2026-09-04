import { useState, useRef, useEffect } from "react";
import type { CountryCode } from "../../types";
import { countries } from "../../config/fees";

const countryOrder: CountryCode[] = ["SE", "NO", "DK", "IT", "ES"];

interface Props {
  selected: CountryCode;
  onChange: (code: CountryCode) => void;
}

export default function CountrySelector({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const country = countries[selected];

  // Same popover contract as the methods dropdown: outside click or Escape
  // closes, and listeners only exist while open.
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Move focus to the current country when the list opens so keyboard users
  // land on their selection rather than the top of the list.
  useEffect(() => {
    if (open) document.getElementById(`country-${selected}`)?.focus();
  }, [open, selected]);

  const select = (code: CountryCode) => {
    onChange(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Roving focus inside the open list; selection only commits on Enter/click.
  const handleOptionKey = (e: React.KeyboardEvent, idx: number) => {
    // Activate explicitly: preventDefault here also suppresses the native
    // button activation, so the option never commits twice.
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(countryOrder[idx]);
      return;
    }
    // Tab moves focus out of the popover, so close it rather than leaving an
    // orphaned list open behind the user.
    if (e.key === "Tab") {
      setOpen(false);
      return;
    }
    const last = countryOrder.length - 1;
    let next = idx;
    if (e.key === "ArrowDown") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowUp") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    document.getElementById(`country-${countryOrder[next]}`)?.focus();
  };

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country: ${country.label}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="country-trigger"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--color-off-white)",
          color: "var(--color-ink)",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background .12s, border-color .12s",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 15, lineHeight: 1 }}>{country.flag}</span>
        <span>{country.label}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            marginLeft: 2,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform .15s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select country"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--color-off-white)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 4,
            minWidth: 180,
            zIndex: 30,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          {countryOrder.map((code, idx) => {
            const option = countries[code];
            const isSelected = selected === code;
            return (
              <button
                key={code}
                id={`country-${code}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => select(code)}
                onKeyDown={(e) => handleOptionKey(e, idx)}
                className="country-option"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "7px 10px",
                  border: "none",
                  background: isSelected ? "rgba(2, 44, 18, 0.07)" : "transparent",
                  borderRadius: 8,
                  textAlign: "left",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 500,
                  color: "var(--color-ink)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1 }}>{option.flag}</span>
                <span style={{ flex: 1 }}>{option.label}</span>
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-moss)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
