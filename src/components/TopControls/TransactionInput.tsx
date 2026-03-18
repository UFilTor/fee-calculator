interface Props {
  value: number;
  onChange: (value: number) => void;
}

export default function TransactionInput({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="monthly-txns" className="text-sm font-medium text-gray-600 whitespace-nowrap">
        Monthly transactions
      </label>
      <input
        id="monthly-txns"
        type="number"
        min={1}
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!isNaN(v) && v > 0) onChange(v);
        }}
        className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-900 focus:border-understory focus:outline-none focus:ring-1 focus:ring-understory"
      />
    </div>
  );
}
