import { useMemo } from "react";
import type { CountryCode, CalculatedRow } from "../types";
import { paymentMethods } from "../config/fees";
import { computeFee, computeSavingsPercent } from "../utils/calculations";

export interface SavingsBreakdown {
  methodId: string;
  methodLabel: string;
  annualSavings: number;
}

export function useCalculator(
  countryCode: CountryCode,
  bookingAmount: number,
  monthlyTransactions: number,
  selectedMethodIds: string[]
) {
  const rows = useMemo<CalculatedRow[]>(() => {
    return paymentMethods
      .filter((method) => method.fees[countryCode] != null)
      .map((method) => {
        const countryFees = method.fees[countryCode]!;
        const understoryFee = computeFee(bookingAmount, countryFees.understory);
        const stripeFee = countryFees.stripe
          ? computeFee(bookingAmount, countryFees.stripe)
          : null;
        const savingsPercent =
          stripeFee !== null
            ? computeSavingsPercent(understoryFee, stripeFee)
            : null;

        return { method, understoryFee, stripeFee, savingsPercent };
      });
  }, [countryCode, bookingAmount]);

  // Only calculate savings for selected methods, split evenly
  const selectedRows = useMemo(
    () => rows.filter((r) => selectedMethodIds.includes(r.method.id) && r.stripeFee !== null),
    [rows, selectedMethodIds]
  );

  const splitCount = selectedRows.length || 1;
  const txnsPerMethod = monthlyTransactions / splitCount;

  const savingsBreakdown = useMemo<SavingsBreakdown[]>(() => {
    return selectedRows.map((r) => ({
      methodId: r.method.id,
      methodLabel: r.method.label,
      annualSavings: (r.stripeFee! - r.understoryFee) * txnsPerMethod * 12,
    }));
  }, [selectedRows, txnsPerMethod]);

  const totalAnnualSavings = useMemo(
    () => savingsBreakdown.reduce((sum, s) => sum + s.annualSavings, 0),
    [savingsBreakdown]
  );

  const totalMonthlyUnderstory = useMemo(
    () => selectedRows.reduce((sum, r) => sum + r.understoryFee * txnsPerMethod, 0),
    [selectedRows, txnsPerMethod]
  );

  const totalMonthlyStripe = useMemo(
    () => selectedRows.reduce((sum, r) => sum + r.stripeFee! * txnsPerMethod, 0),
    [selectedRows, txnsPerMethod]
  );

  // All methods offered in the country, including ones with no Stripe
  // comparison (e.g. MobilePay in DK). Methods without a Stripe rate
  // contribute nothing to the savings calc, but they still appear as
  // chips so the user can see the full Understory Pay coverage.
  const availableMethods = useMemo(
    () => rows.map((r) => ({ id: r.method.id, label: r.method.label })),
    [rows]
  );

  return {
    rows,
    savingsBreakdown,
    totalAnnualSavings,
    totalMonthlyUnderstory,
    totalMonthlyStripe,
    availableMethods,
  };
}
