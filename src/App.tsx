import { lazy, Suspense, useState, useRef } from "react";
import type { CountryCode } from "./types";
import understoryLogo from "./assets/understory-logo-mark.png";
import { countries } from "./config/fees";
import { useCalculator } from "./hooks/useCalculator";
import { getInitialStateFromUrl, useSyncUrlState } from "./hooks/useUrlState";
import Layout from "./components/Layout";
import CountrySelector from "./components/TopControls/CountrySelector";
import BookingAmountInput from "./components/TopControls/BookingAmountInput";
import ComparisonTable from "./components/ComparisonTable/ComparisonTable";
import SavingsSummary from "./components/SavingsSummary";

const ExportButton = lazy(() => import("./components/ExportButton"));
const Retune = import.meta.env.DEV
  ? lazy(() => import("retune").then((m) => ({ default: m.Retune })))
  : null;

const initialState = getInitialStateFromUrl();

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>(initialState.countryCode);
  const [bookingAmount, setBookingAmount] = useState(initialState.bookingAmount);
  const [monthlyTransactions, setMonthlyTransactions] = useState(initialState.monthlyTransactions);
  const [selectedMethodIds, setSelectedMethodIds] = useState<string[]>([]);
  const [prevCountryCode, setPrevCountryCode] = useState(countryCode);
  const exportRef = useRef<HTMLDivElement>(null);

  // On country change, only reset the booking amount when the user is
  // still on the previous country's default. Custom amounts carry over,
  // so a typed "1200" in SE stays "1200" in NO. Method selection always
  // resets because available methods differ per country; the all-methods
  // auto-fill below picks it up on the next render.
  const isCountryChanging = prevCountryCode !== countryCode;
  if (isCountryChanging) {
    const prevDefault = countries[prevCountryCode].defaultAmount;
    setPrevCountryCode(countryCode);
    if (bookingAmount === prevDefault) {
      setBookingAmount(countries[countryCode].defaultAmount);
    }
    setSelectedMethodIds([]);
  }

  const country = countries[countryCode];
  const {
    rows,
    savingsBreakdown,
    totalAnnualSavings,
    totalMonthlyStripe,
    availableMethods,
  } = useCalculator(countryCode, bookingAmount, monthlyTransactions, selectedMethodIds);

  // Default to all methods on. Skipped during a country switch so the
  // reset above isn't immediately overwritten by a filtered subset of
  // the previous country's selections.
  if (!isCountryChanging) {
    if (selectedMethodIds.length === 0 && availableMethods.length > 0) {
      setSelectedMethodIds(availableMethods.map((m) => m.id));
    }
  }

  useSyncUrlState(countryCode, bookingAmount, monthlyTransactions);

  return (
    <Layout>
      <div
        ref={exportRef}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Logo + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={understoryLogo}
            alt="Understory"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              objectFit: "cover",
              display: "block",
            }}
          />
          <span
            className="u-label"
            style={{ color: "var(--color-moss)", fontSize: 18 }}
          >
            Understory Pay
          </span>
        </div>

        {/* Hero headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(34px, 4.6vw, 50px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            margin: 0,
            color: "var(--color-moss)",
            maxWidth: 720,
          }}
        >
          See what you'd <span style={{ color: "var(--color-rust)" }}>save with Understory Pay</span>
        </h1>

        {/* Top controls surface */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "14px 20px",
            background: "var(--color-off-white)",
            border: "1px solid var(--border)",
            borderRadius: 16,
          }}
        >
          <BookingAmountInput
            value={bookingAmount}
            onChange={setBookingAmount}
            country={country}
          />
          <CountrySelector selected={countryCode} onChange={setCountryCode} />
        </div>

        {/* Comparison surface */}
        <ComparisonTable rows={rows} country={country} />

        {/* Savings hero card */}
        <SavingsSummary
          savingsBreakdown={savingsBreakdown}
          totalAnnualSavings={totalAnnualSavings}
          totalAnnualStripe={totalMonthlyStripe * 12}
          monthlyTransactions={monthlyTransactions}
          onMonthlyTransactionsChange={setMonthlyTransactions}
          bookingAmount={bookingAmount}
          country={country}
          availableMethods={availableMethods}
          selectedMethodIds={selectedMethodIds}
          onSelectedMethodsChange={setSelectedMethodIds}
        />
      </div>

      {/* Export & Footer (outside export area) */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }} data-export-hide>
        <Suspense fallback={null}>
          <ExportButton targetRef={exportRef} />
        </Suspense>
      </div>
      {Retune && (
        <Suspense fallback={null}>
          <Retune />
        </Suspense>
      )}
    </Layout>
  );
}
