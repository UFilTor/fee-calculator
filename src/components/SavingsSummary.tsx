import { useState } from "react";
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

  if (prevTxn !== monthlyTransactions) {
    setPrevTxn(monthlyTransactions);
    setTxnInputValue(String(monthlyTransactions));
  }

  const allOn = selectedMethodIds.length === availableMethods.length;

  // cmd / ctrl / shift click on a chip selects only that method ("solo");
  // plain click toggles. Last-on chip is disabled to prevent zero
  // selection.
  const handleChipClick = (id: string, e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) {
      onSelectedMethodsChange([id]);
      return;
    }
    if (selectedMethodIds.includes(id)) {
      if (selectedMethodIds.length > 1) {
        onSelectedMethodsChange(selectedMethodIds.filter((m) => m !== id));
      }
    } else {
      onSelectedMethodsChange([...selectedMethodIds, id]);
    }
  };

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

              {/* Inline method chips: visible-by-default toggles. Plain
                  click toggles, cmd/ctrl/shift click solos. The "All"
                  link to the right resets to all-on. */}
              {availableMethods.length > 1 && (
                <div
                  role="group"
                  aria-label="Methods included in calculation"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "rgba(248,246,237,0.82)",
                    marginTop: 2,
                  }}
                >
                  <span style={{ marginRight: 2 }}>Includes</span>
                  {availableMethods.map((m) => {
                    const on = selectedMethodIds.includes(m.id);
                    const isLastOn = on && selectedMethodIds.length === 1;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-label={`Include ${m.label}`}
                        disabled={isLastOn}
                        onClick={(e) => handleChipClick(m.id, e)}
                        title={`${m.label} (⌘/Ctrl-click to solo)`}
                        className="focus-light"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "3px 9px",
                          borderRadius: 999,
                          border: on
                            ? "1px solid rgba(240,249,126,0.6)"
                            : "1px solid rgba(248,246,237,0.32)",
                          background: on ? "rgba(240,249,126,0.14)" : "transparent",
                          color: on ? "var(--color-citrus)" : "rgba(248,246,237,0.82)",
                          fontSize: 12,
                          fontWeight: 500,
                          fontFamily: "inherit",
                          cursor: isLastOn ? "default" : "pointer",
                          opacity: isLastOn ? 0.85 : 1,
                          transition: "background .12s, color .12s, border-color .12s",
                        }}
                      >
                        <span
                          aria-hidden
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: on ? "var(--color-citrus)" : "transparent",
                            border: on ? "none" : "1px solid rgba(248,246,237,0.5)",
                          }}
                        />
                        {m.label}
                      </button>
                    );
                  })}
                  {!allOn && (
                    <button
                      type="button"
                      onClick={() =>
                        onSelectedMethodsChange(availableMethods.map((m) => m.id))
                      }
                      className="focus-light"
                      style={{
                        marginLeft: 4,
                        padding: "3px 4px",
                        background: "transparent",
                        border: "none",
                        color: "rgba(248,246,237,0.82)",
                        fontSize: 12,
                        fontWeight: 500,
                        fontFamily: "inherit",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textUnderlineOffset: 2,
                      }}
                    >
                      All
                    </button>
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
