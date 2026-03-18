import type { CalculatedRow, Country } from "../../types";
import TableRow from "./TableRow";

interface Props {
  rows: CalculatedRow[];
  country: Country;
  bookingAmount: number;
}

export default function ComparisonTable({ rows, country, bookingAmount }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto sm:mx-0">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
              Payment method
            </th>
            <th className="py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
              Understory Pay
            </th>
            <th className="py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
              Stripe
            </th>
            <th className="py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
              Savings
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <TableRow
              key={row.method.id}
              row={row}
              country={country}
              bookingAmount={bookingAmount}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
