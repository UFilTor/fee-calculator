export type CountryCode = "SE" | "NO" | "DK" | "IT" | "ES";

export interface FeeStructure {
  percentage: number;
  fixedFee: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
  sub?: string;
  icon: "card" | "klarna" | "swish" | "vipps" | "mobilepay";
  fees: Partial<Record<CountryCode, {
    understory: FeeStructure;
    stripe: FeeStructure | null;
  }>>;
  footnote?: Partial<Record<CountryCode, string>>;
}

export interface Country {
  code: CountryCode;
  label: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  defaultAmount: number;
  locale: string;
}

export interface CalculatedRow {
  method: PaymentMethod;
  understoryFee: number;
  stripeFee: number | null;
  savingsPercent: number | null;
}
