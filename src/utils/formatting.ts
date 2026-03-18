import type { Country } from "../types";

export function formatCurrency(
  amount: number,
  country: Country
): string {
  // Format with 2 decimal places, using locale
  const formatted = new Intl.NumberFormat(country.locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${country.currencySymbol}`;
}

export function formatFeeBreakdown(
  percentage: number,
  fixedFee: number,
  currencySymbol: string
): string {
  const parts: string[] = [];
  if (percentage > 0) {
    parts.push(`${percentage}%`);
  }
  if (fixedFee > 0) {
    parts.push(`${fixedFee} ${currencySymbol}`);
  }
  return parts.join(" + ");
}
