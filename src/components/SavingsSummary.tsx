import { useState, useRef, useEffect } from "react";
import type { Country } from "../types";
import type { SavingsBreakdown } from "../hooks/useCalculator";
import { formatCurrency } from "../utils/formatting";

interface Props {
  savingsBreakdown: SavingsBreakdown[];
  totalAnnualSavings: number;
  totalAnnualStripe: number;
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
  totalAnnualStripe,
  monthlyTransactions,
  onMonthlyTransactionsChange,
  bookingAmount,
  country,
  availableMethods,
  selectedMethodIds,
  onSelectedMethodsChange,
}: Props) {
  const [txnInputValue, setTxnInputValue] = useState(String(monthlyTransactions));
  const [prevTxn, setPrevTxn] = useState(monthlyTransactions);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [methodsOpen, setMethodsOpen] = useState(false);
  const methodsRef = useRef<HTMLDivElement>(null);

  if (prevTxn !== monthlyTransactions) {
    setPrevTxn(monthlyTransactions);
    setTxnInputValue(String(monthlyTransactions));
  }

  // Close the methods popover on outside click or Escape; only attach
  // listeners while open.
  useEffect(() => {
    if (!methodsOpen) return;
    function handleClick(e: MouseEvent) {
      if (methodsRef.current && !methodsRef.current.contains(e.target as Node)) {
        setMethodsOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMethodsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [methodsOpen]);

  const allOn = selectedMethodIds.length === availableMethods.length;

  const toggleMethod = (id: string) => {
    if (selectedMethodIds.includes(id)) {
      if (selectedMethodIds.length > 1) {
        onSelectedMethodsChange(selectedMethodIds.filter((m) => m !== id));
      }
    } else {
      onSelectedMethodsChange([...selectedMethodIds, id]);
    }
  };

  const triggerLabel = allOn
    ? "All methods"
    : selectedMethodIds.length === 1
      ? availableMethods.find((m) => m.id === selectedMethodIds[0])?.label ?? "1 method"
      : `${selectedMethodIds.length} methods`;

  const isLoss = totalAnnualSavings < 0;
  const headline = isLoss
    ? "Stripe is cheaper for this mix"
    : "Estimated annual savings";
  const monthly = totalAnnualSavings / 12;

  return (
    <div className="space-y-3">
      <div
        className="print-soft"
        style={{
          position: "relative",
          borderRadius: 20,
          background: "var(--color-moss)",
          color: "var(--color-light-grey)",
          padding: "20px 28px",
          isolation: "isolate",
        }}
      >
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
            className="savings-hero-row"
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  className="u-label"
                  style={{ color: isLoss ? "var(--color-light-grey)" : "var(--color-citrus)" }}
                >
                  {headline}
                </span>
                <button
                  type="button"
                  aria-label="How is this calculated?"
                  aria-expanded={methodologyOpen}
                  onClick={() => setMethodologyOpen((v) => !v)}
                  className="focus-light"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    border: "1px solid rgba(248,246,237,0.45)",
                    background: "transparent",
                    color: "rgba(248,246,237,0.82)",
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ?
                </button>
              </div>

              {methodologyOpen && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 11.5,
                    lineHeight: 1.5,
                    color: "rgba(248,246,237,0.78)",
                    maxWidth: "55ch",
                  }}
                >
                  Stripe rates from public pricing. Excludes 3DS
                  authentication, chargebacks, and currency conversion.
                  Understory Pay rates per active contract.
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "rgba(248,246,237,0.82)",
                  lineHeight: 1.5,
                }}
              >
                <span>Based on</span>
                <label htmlFor="monthly-txns" className="sr-only">Monthly transactions</label>
                <input
                  id="monthly-txns"
                  type="number"
                  min={1}
                  value={txnInputValue}
                  aria-label="Monthly transactions"
                  className="focus-light"
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
                    borderRadius: 8,
                    border: "none",
                    background: "rgba(255,255,255,0.10)",
                    color: "var(--color-light-grey)",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
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

              {/* Methods dropdown: single-control trigger keeps the left
                  column width predictable across countries so the
                  savings number always right-aligns the same way. */}
              {availableMethods.length > 1 && (
                <div
                  ref={methodsRef}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 12,
                    color: "rgba(248,246,237,0.82)",
                    marginTop: 2,
                  }}
                >
                  <span>Includes</span>
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={methodsOpen}
                    onClick={() => setMethodsOpen((v) => !v)}
                    className="focus-light"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 8,
                      border: "1px solid rgba(248,246,237,0.32)",
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--color-light-grey)",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <span>{triggerLabel}</span>
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
                        transform: methodsOpen ? "rotate(180deg)" : "none",
                        transition: "transform .15s",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {methodsOpen && (
                    <div
                      role="menu"
                      aria-label="Methods to include"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 60,
                        background: "var(--color-off-white)",
                        color: "var(--color-ink)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        padding: 4,
                        minWidth: 240,
                        zIndex: 30,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                      }}
                    >
                      {availableMethods.map((m) => {
                        const on = selectedMethodIds.includes(m.id);
                        const isLastOn = on && selectedMethodIds.length === 1;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={on}
                            disabled={isLastOn}
                            onClick={() => toggleMethod(m.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              width: "100%",
                              padding: "7px 10px",
                              border: "none",
                              background: "transparent",
                              cursor: isLastOn ? "default" : "pointer",
                              borderRadius: 8,
                              textAlign: "left",
                              fontFamily: "inherit",
                              color: "var(--color-ink)",
                              fontSize: 13,
                              opacity: isLastOn ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isLastOn) {
                                e.currentTarget.style.background = "rgba(2,44,18,0.06)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <span
                              aria-hidden
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
                      {!allOn && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectedMethodsChange(availableMethods.map((m) => m.id));
                          }}
                          style={{
                            marginTop: 4,
                            padding: "7px 10px",
                            width: "100%",
                            border: "none",
                            borderTop: "1px solid var(--border)",
                            borderRadius: 0,
                            background: "transparent",
                            color: "var(--color-moss)",
                            fontFamily: "inherit",
                            fontSize: 12,
                            fontWeight: 500,
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          Select all
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* The number, with anchor + monthly framing. */}
            <div
              className="savings-hero-number"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                minWidth: 0,
              }}
            >
              {!isLoss && totalAnnualStripe > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(248,246,237,0.65)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  On Stripe today: ≈ {formatCurrency(totalAnnualStripe, country)} / yr
                </div>
              )}
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 7vw, 72px)",
                  lineHeight: 0.9,
                  letterSpacing: "-0.02em",
                  color: isLoss ? "var(--color-light-grey)" : "var(--color-citrus)",
                  fontVariantNumeric: "tabular-nums",
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                {formatCurrency(Math.abs(totalAnnualSavings), country)}
              </div>
              {Math.abs(totalAnnualSavings) >= 1 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(248,246,237,0.82)",
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "0.01em",
                  }}
                >
                  {isLoss ? "extra " : ""}≈ {formatCurrency(Math.abs(monthly), country)} / month
                </div>
              )}
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
                      color: "rgba(248,246,237,0.82)",
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

          {/* Single-line provenance citation. Brings back the credibility
              cue without the previous paragraph's visual weight. */}
          <div
            style={{
              fontSize: 11,
              color: "rgba(248,246,237,0.55)",
              letterSpacing: "0.01em",
            }}
          >
            Stripe and Understory Pay public rates, May 2026.
          </div>
        </div>
      </div>
    </div>
  );
}
