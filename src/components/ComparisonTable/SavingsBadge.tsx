interface Props {
  percent: number;
}

export default function SavingsBadge({ percent }: Props) {
  if (Math.abs(percent) < 0.1) return null;

  const isPositive = percent > 0;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPositive
          ? "bg-savings-bg text-savings"
          : "bg-red-50 text-red-600"
      }`}
    >
      {isPositive ? "+" : ""}
      {percent.toFixed(0)}%
    </span>
  );
}
