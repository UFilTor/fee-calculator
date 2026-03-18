import type { FeeStructure } from "../types";

export function computeFee(amount: number, fee: FeeStructure): number {
  return (amount * fee.percentage) / 100 + fee.fixedFee;
}

export function computeSavingsPercent(
  understoryFee: number,
  stripeFee: number
): number {
  if (stripeFee === 0) return 0;
  return ((stripeFee - understoryFee) / stripeFee) * 100;
}
