import { useEffect } from "react";
import type { CountryCode } from "../types";
import { countries } from "../config/fees";

const validCountries = new Set<string>(["SE", "NO", "DK", "IT"]);

interface UrlState {
  countryCode: CountryCode;
  bookingAmount: number;
  monthlyTransactions: number;
}

export function getInitialStateFromUrl(): UrlState {
  const params = new URLSearchParams(window.location.search);

  const rawCountry = params.get("country");
  const countryCode: CountryCode =
    rawCountry && validCountries.has(rawCountry)
      ? (rawCountry as CountryCode)
      : "SE";

  const rawAmount = params.get("amount");
  const bookingAmount =
    rawAmount && parseInt(rawAmount, 10) > 0
      ? parseInt(rawAmount, 10)
      : countries[countryCode].defaultAmount;

  const rawTxns = params.get("txns");
  const monthlyTransactions =
    rawTxns && parseInt(rawTxns, 10) > 0
      ? parseInt(rawTxns, 10)
      : 100;

  return { countryCode, bookingAmount, monthlyTransactions };
}

export function useSyncUrlState(
  countryCode: CountryCode,
  bookingAmount: number,
  monthlyTransactions: number
) {
  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
  }, [countryCode, bookingAmount, monthlyTransactions]);
}
