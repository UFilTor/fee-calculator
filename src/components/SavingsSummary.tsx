import { useState, useRef, useEffect } from "react";
import type { Country } from "../types";
import type { SavingsBreakdown } from "../hooks/useCalculator";
import { formatCurrency } from "../utils/formatting";

interface Props {
  savingsBreakdown: SavingsBreakdown[];
  totalAnnualSavings: number;
  totalMonthlyUnderstory: number;
  totalMonthlyStripe: number;
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
  totalMonthlyUnderstory,
  totalMonthlyStripe,
  monthlyTransactions,
  onMonthlyTransactionsChange,
  bookingAmount,
  country,
  availableMethods,
  selectedMethodIds,
  onSelectedMethodsChange,
}: Props) {
  const [showCosts, setShowCosts] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  const selectedLabel =
    selectedMethodIds.length === availableMethods.length
      ? "All methods"
      : selectedMethodIds.length === 1
        ? availableMethods.find((m) => m.id === selectedMethodIds[0])?.label ?? ""
        : `${selectedMethodIds.length} methods`;

  return (
    <div className="space-y-3">
      {/* Main savings card */}
      <div className="rounded-xl bg-understory-dark p-4 sm:p-6 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="text-sm font-medium text-green-200 uppercase tracking-wider">
              Estimated Annual Savings
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-green-300">
              <span>Based on</span>
              <input
                type="number"
                min={1}
                value={monthlyTransactions}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v > 0) onMonthlyTransactionsChange(v);
                }}
                className="w-16 rounded bg-white/10 px-1.5 py-0.5 text-xs font-semibold text-white text-center focus:outline-none focus:ring-1 focus:ring-green-300"
              />
              <span>transactions/month at {formatCurrency(bookingAmount, country)}</span>
            </div>

            {/* Method selector dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded bg-white/10 px-2.5 py-1 text-xs text-green-200 hover:bg-white/20 transition-colors cursor-pointer"
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
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-20 rounded-lg bg-white shadow-lg border border-gray-200 py-1 min-w-[200px]">
                  {availableMethods.map((m) => {
                    const isSelected = selectedMethodIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMethod(m.id)}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isSelected
                              ? "bg-understory border-understory text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="text-gray-700">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold tabular-nums transition-opacity duration-200">
            {formatCurrency(totalAnnualSavings, country)}
          </div>
        </div>

        {/* Per-method breakdown */}
        {savingsBreakdown.length > 1 && (
          <div className="mt-4 border-t border-white/20 pt-3 space-y-1">
            {savingsBreakdown.map((s) => (
              <div key={s.methodId} className="flex items-center justify-between text-xs text-green-200">
                <span>{s.methodLabel}</span>
                <span>{formatCurrency(s.annualSavings, country)}/yr</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly cost toggle */}
      <button
        onClick={() => setShowCosts(!showCosts)}
        className="text-xs text-gray-500 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${showCosts ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Monthly cost comparison
      </button>
      {showCosts && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-understory-light p-4">
            <div className="text-xs font-medium text-understory uppercase tracking-wider">Understory Pay / month</div>
            <div className="mt-1 text-lg font-bold text-understory-dark">
              {formatCurrency(totalMonthlyUnderstory, country)}
            </div>
          </div>
          <div className="rounded-lg bg-gray-100 p-4">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe / month</div>
            <div className="mt-1 text-lg font-bold text-gray-700">
              {formatCurrency(totalMonthlyStripe, country)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
