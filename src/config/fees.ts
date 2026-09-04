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
  ES: {
    code: "ES",
    label: "Spain",
    flag: "🇪🇸",
    currency: "EUR",
    currencySymbol: "€",
    defaultAmount: 50,
    locale: "es-ES",
  },
};

export const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    label: "Card",
    sub: "EEA Visa / Mastercard",
    icon: "card",
    fees: {
      SE: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.5, fixedFee: 1.80 },
      },
      NO: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 2.4, fixedFee: 2 },
      },
      DK: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.5, fixedFee: 1.80 },
      },
      IT: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.5, fixedFee: 0.25 },
      },
      ES: {
        understory: { percentage: 1.4, fixedFee: 0 },
        stripe: { percentage: 1.5, fixedFee: 0.25 },
      },
    },
  },
  {
    id: "swish",
    label: "Swish",
    sub: "Sweden",
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
    sub: "Norway",
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
    sub: "Denmark",
    icon: "mobilepay",
    fees: {
      DK: {
        understory: { percentage: 1.4, fixedFee: 2 },
        stripe: { percentage: 1.5, fixedFee: 2.80 },
      },
    },
    footnote: {
      DK: "Stripe Dit MobilePay also has a 35 DKK/month membership fee (not included above).",
    },
  },
  {
    id: "klarna-pay-now",
    label: "Klarna Pay Now",
    sub: "Klarna",
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
    sub: "Klarna",
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
    sub: "Klarna",
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
];
