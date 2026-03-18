import type { Country, CountryCode, PaymentMethod } from "../types";

export const countries: Record<CountryCode, Country> = {
  SE: {
    code: "SE",
    label: "Sweden",
    flag: "🇸🇪",
    currency: "SEK",
    currencySymbol: "kr",
    defaultAmount: 500,
    locale: "sv-SE",
  },
  NO: {
    code: "NO",
    label: "Norway",
    flag: "🇳🇴",
    currency: "NOK",
    currencySymbol: "kr",
    defaultAmount: 500,
    locale: "nb-NO",
  },
  DK: {
    code: "DK",
    label: "Denmark",
    flag: "🇩🇰",
    currency: "DKK",
    currencySymbol: "kr",
    defaultAmount: 500,
    locale: "da-DK",
  },
  IT: {
    code: "IT",
    label: "Italy",
    flag: "🇮🇹",
    currency: "EUR",
    currencySymbol: "€",
    defaultAmount: 50,
    locale: "it-IT",
  },
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    label: "Card (EEA Visa/Mastercard)",
    icon: "card",
    fees: {
      SE: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.4, fixedFee: 1.80 },
      },
      NO: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.4, fixedFee: 1.80 },
      },
      DK: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.4, fixedFee: 1.80 },
      },
      IT: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.4, fixedFee: 0.25 },
      },
    },
  },
  {
    id: "klarna-pay-now",
    label: "Klarna Pay Now",
    icon: "klarna",
    fees: {
      SE: {
        understory: { percentage: 2.0, fixedFee: 3 },
        stripe: { percentage: 2.99, fixedFee: 4.00 },
      },
    },
  },
  {
    id: "klarna-pay-over-time",
    label: "Klarna Pay Over Time",
    icon: "klarna",
    fees: {
      SE: {
        understory: { percentage: 1.5, fixedFee: 6.50 },
        stripe: { percentage: 2.99, fixedFee: 4.00 },
      },
      NO: {
        understory: { percentage: 1.5, fixedFee: 6.50 },
        stripe: { percentage: 2.99, fixedFee: 4.00 },
      },
    },
  },
  {
    id: "klarna-buy-now-pay-later",
    label: "Klarna Buy Now, Pay Later",
    icon: "klarna",
    fees: {
      SE: {
        understory: { percentage: 2.5, fixedFee: 5 },
        stripe: { percentage: 2.99, fixedFee: 4.00 },
      },
      NO: {
        understory: { percentage: 2.5, fixedFee: 5 },
        stripe: { percentage: 2.99, fixedFee: 4.00 },
      },
      DK: {
        understory: { percentage: 2.5, fixedFee: 5 },
        stripe: { percentage: 2.99, fixedFee: 3.50 },
      },
    },
  },
  {
    id: "swish",
    label: "Swish",
    icon: "swish",
    fees: {
      SE: {
        understory: { percentage: 1.0, fixedFee: 3.50 },
        stripe: null,
      },
    },
  },
  {
    id: "vipps",
    label: "Vipps",
    icon: "vipps",
    fees: {
      NO: {
        understory: { percentage: 1.4, fixedFee: 2 },
        stripe: null,
      },
    },
  },
  {
    id: "mobilepay",
    label: "MobilePay",
    icon: "mobilepay",
    fees: {
      DK: {
        understory: { percentage: 1.4, fixedFee: 2 },
        stripe: null,
      },
    },
    footnote: {
      DK: "Stripe Dit MobilePay also has a 35 DKK/month membership fee (not included above).",
    },
  },
];
