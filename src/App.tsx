import { useState, useRef, useEffect } from "react";
import { Retune } from "retune";
import type { CountryCode } from "./types";
import { countries } from "./config/fees";
import { useCalculator } from "./hooks/useCalculator";
import { getInitialStateFromUrl, useSyncUrlState } from "./hooks/useUrlState";
import Layout from "./components/Layout";
import CountrySelector from "./components/TopControls/CountrySelector";
import BookingAmountInput from "./components/TopControls/BookingAmountInput";
import ComparisonTable from "./components/ComparisonTable/ComparisonTable";
import SavingsSummary from "./components/SavingsSummary";
import ExportButton from "./components/ExportButton";

const initialState = getInitialStateFromUrl();

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>(initialState.countryCode);
  const [bookingAmount, setBookingAmount] = useState(initialState.bookingAmount);
  const [monthlyTransactions, setMonthlyTransactions] = useState(initialState.monthlyTransactions);
  const [selectedMethodIds, setSelectedMethodIds] = useState<string[]>([]);
  const exportRef = useRef<HTMLDivElement>(null);

  const country = countries[countryCode];
  const {
    rows,
    savingsBreakdown,
    totalAnnualSavings,
    availableMethods,
  } = useCalculator(countryCode, bookingAmount, monthlyTransactions, selectedMethodIds);

  useSyncUrlState(countryCode, bookingAmount, monthlyTransactions);

  useEffect(() => {
    setBookingAmount(countries[countryCode].defaultAmount);
    setSelectedMethodIds([]);
  }, [countryCode]);

  useEffect(() => {
    if (selectedMethodIds.length === 0 && availableMethods.length > 0) {
      setSelectedMethodIds(availableMethods.map((m) => m.id));
    }
  }, [availableMethods, selectedMethodIds.length]);

  return (
    <Layout>
      <div
        ref={exportRef}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        {/* Logo + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            className="text-left"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: "var(--color-moss)",
              color: "var(--color-citrus)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            U
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              className="u-label"
              style={{ color: "var(--color-moss)", fontSize: 11 }}
            >
              Understory Pay
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-muted)",
              }}
            >
              Fee comparison
            </span>
          </div>
        </div>

        {/* Hero headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(34px, 4.6vw, 52px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            margin: 0,
            color: "var(--color-moss)",
            maxWidth: 720,
          }}
        >
          See what you'd save with{" "}
          <span style={{ color: "var(--color-rust)" }}>Understory Pay</span>
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
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <ExportButton targetRef={exportRef} />
      </div>
      <Retune />
    </Layout>
  );
}
