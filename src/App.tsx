import { useState, useRef, useEffect } from "react";
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
import Footer from "./components/Footer";
import understoryLogo from "./assets/understory-logo.png";

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
    totalMonthlyUnderstory,
    totalMonthlyStripe,
    availableMethods,
  } = useCalculator(countryCode, bookingAmount, monthlyTransactions, selectedMethodIds);

  // Sync state to URL
  useSyncUrlState(countryCode, bookingAmount, monthlyTransactions);

  // Reset booking amount and selected methods when country changes
  useEffect(() => {
    setBookingAmount(countries[countryCode].defaultAmount);
    setSelectedMethodIds([]);
  }, [countryCode]);

  // Auto-select all available methods when they change and nothing is selected
  useEffect(() => {
    if (selectedMethodIds.length === 0 && availableMethods.length > 0) {
      setSelectedMethodIds(availableMethods.map((m) => m.id));
    }
  }, [availableMethods, selectedMethodIds.length]);


  return (
    <Layout>
      <div ref={exportRef} className="space-y-6">
        {/* Logo */}
        <img src={understoryLogo} alt="Understory" className="h-14 w-14 sm:h-20 sm:w-20 rounded-lg mx-auto" />
        {/* Top Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <BookingAmountInput
            value={bookingAmount}
            onChange={setBookingAmount}
            country={country}
          />
          <CountrySelector selected={countryCode} onChange={setCountryCode} />
        </div>

        {/* Comparison Table */}
        <ComparisonTable rows={rows} country={country} bookingAmount={bookingAmount} />

        {/* Savings Summary */}
        <SavingsSummary
          savingsBreakdown={savingsBreakdown}
          totalAnnualSavings={totalAnnualSavings}
          totalMonthlyUnderstory={totalMonthlyUnderstory}
          totalMonthlyStripe={totalMonthlyStripe}
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
      <div className="mt-6 flex justify-end">
        <ExportButton targetRef={exportRef} />
      </div>
      <Footer />
    </Layout>
  );
}
