import { useState, useRef, useEffect } from "react";
import type { Country } from "../types";
import type { SavingsBreakdown } from "../hooks/useCalculator";
import { formatCurrency } from "../utils/formatting";
import wiggleDots from "../assets/wiggle-dots-3.png";

interface Props {
  savingsBreakdown: SavingsBreakdown[];
  totalAnnualSavings: number;
  monthlyTransactions: number;
  onMonthlyTransactionsChange: (value: number) => void;
  bookingAmount: number;
  country: Country;
  availableMethods: { id: string; label: string }[];
  selectedMethodIds: string[];
  onSelectedMethodsChange: (ids: string[]) => void;
}

export default function SavingsSummary({
  savingsBreakdown,
  totalAnnualSavings,
  monthlyTransactions,
  onMonthlyTransactionsChange,
  bookingAmount,
  country,
  availableMethods,
  selectedMethodIds,
  onSelectedMethodsChange,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [txnInputValue, setTxnInputValue] = useState(String(monthlyTransactions));
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTxnInputValue(String(monthlyTransactions));
  }, [monthlyTransactions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleMethod = (id: string) => {
    if (selectedMethodIds.includes(id)) {
      if (selectedMethodIds.length > 1) {
        onSelectedMethodsChange(selectedMethodIds.filter((m) => m !== id));
      }
    } else {
      onSelectedMethodsChange([...selectedMethodIds, id]);
    }
  };

  const allOn = selectedMethodIds.length === availableMethods.length;
  const selectedLabel = allOn
    ? "All methods"
    : selectedMethodIds.length === 1
      ? availableMethods.find((m) => m.id === selectedMethodIds[0])?.label ?? ""
      : `${selectedMethodIds.length} methods`;

  return (
    <div className="space-y-3">
      <div
        style={{
          position: "relative",
          borderRadius: 20,
          background: "var(--color-moss)",
          color: "var(--color-light-grey)",
          padding: "20px 28px",
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <img
          src={wiggleDots}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 360,
            height: 360,
            objectFit: "cover",
            opacity: 0.35,
            mixBlendMode: "screen",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minWidth: 0,
              }}
            >
              <div
                className="u-label"
                style={{ color: "var(--color-citrus)" }}
              >
                Estimated annual savings
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(248,246,237,0.65)",
                  lineHeight: 1.5,
                }}
              >
                <span>Based on</span>
                <input
                  type="number"
                  min={1}
                  value={txnInputValue}
                  onChange={(e) => {
                    setTxnInputValue(e.target.value);
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v > 0) onMonthlyTransactionsChange(v);
                  }}
                  onBlur={() => {
                    const v = parseInt(txnInputValue, 10);
                    if (isNaN(v) || v < 1) {
                      setTxnInputValue(String(monthlyTransactions));
                    }
                  }}
                  style={{
                    width: 64,
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "none",
                    background: "rgba(255,255,255,0.10)",
                    color: "var(--color-light-grey)",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                    outline: "none",
                    fontFamily: "inherit",
                    fontVariantNumeric: "tabular-nums",
                  }}
                />
                <span>transactions / month at</span>
                <span
                  style={{
                    fontWeight: 600,
                    color: "var(--color-light-grey)",
                  }}
                >
                  {formatCurrency(bookingAmount, country)}
                </span>
              </div>

              {availableMethods.length > 1 && (
                <div
                  ref={dropdownRef}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: "rgba(248,246,237,0.65)",
                    marginTop: 2,
                  }}
                >
                  <span>Includes</span>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "none",
                      background: "rgba(255,255,255,0.10)",
                      color: "var(--color-light-grey)",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <span>{selectedLabel}</span>
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
                        transform: dropdownOpen ? "rotate(180deg)" : "none",
                        transition: "transform .15s",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 60,
                        background: "var(--color-off-white)",
                        color: "var(--color-ink)",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        padding: 4,
                        minWidth: 220,
                        zIndex: 30,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                      }}
                    >
                      {availableMethods.map((m) => {
                        const on = selectedMethodIds.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleMethod(m.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              width: "100%",
                              padding: "6px 10px",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              borderRadius: 6,
                              textAlign: "left",
                              fontFamily: "inherit",
                              color: "var(--color-ink)",
                              fontSize: 13,
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = "rgba(2,44,18,0.06)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <span
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: 4,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: on ? "var(--color-moss)" : "transparent",
                                border: on
                                  ? "1px solid var(--color-moss)"
                                  : "1px solid rgba(2,44,18,0.25)",
                                color: "var(--color-citrus)",
                              }}
                            >
                              {on && (
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </span>
                            <span>{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(48px, 7vw, 72px)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: "var(--color-citrus)",
                fontVariantNumeric: "tabular-nums",
                textTransform: "uppercase",
                textAlign: "right",
              }}
            >
              {formatCurrency(totalAnnualSavings, country)}
            </div>
          </div>

          {savingsBreakdown.length > 1 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 10,
                paddingTop: 12,
                borderTop: "1px solid rgba(248,246,237,0.18)",
              }}
            >
              {savingsBreakdown.map((s) => (
                <div
                  key={s.methodId}
                  style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(248,246,237,0.65)",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.methodLabel}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 18,
                      color: "var(--color-light-grey)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatCurrency(s.annualSavings, country)}
                    <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 2 }}>/yr</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
