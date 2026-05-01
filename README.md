# Understory Pay Fee Calculator

Internal tool used by Understory's CS team to compare Understory Pay rates against Stripe for prospects in Sweden, Norway, Denmark, and Italy. The page renders an annual savings figure based on a typical booking amount and monthly transaction volume, with a per-method breakdown for the customer's market. Reps share the link or PNG export during sales calls.

## Run locally

```
npm install
npm run dev
```

Build with `npm run build`, lint with `npm run lint`. Vite + React 19 + TypeScript, no test runner configured.

## Where things live

- `src/config/fees.ts`: source of truth for country pricing. Add a country or change a Stripe / Understory rate here.
- `src/hooks/useCalculator.ts`: derives table rows, breakdown, and totals from `selectedMethodIds`.
- `src/components/SavingsSummary.tsx`: the moss savings card. Headline, monthly framing, and method chips.
- `src/components/ComparisonTable/`: per-method fee table with mobile-stack layout below 480px.
- `src/hooks/useUrlState.ts`: country + amount + transaction count sync to URL so reps can share a configured view.

URL params: `?country=SE|NO|DK|IT&amount=<int>&txns=<int>`. Method filtering is session-only; toggling chips does not persist.
