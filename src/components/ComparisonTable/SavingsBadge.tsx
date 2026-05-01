interface Props {
  percent: number;
}

export default function SavingsBadge({ percent }: Props) {
  if (Math.abs(percent) < 0.1) return null;

  const isPositive = percent > 0;
  const abs = Math.abs(percent).toFixed(0);

  return (
    <span
      aria-label={
        isPositive
          ? `Understory saves ${abs} percent`
          : `Understory costs ${abs} percent more`
      }
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: isPositive ? "var(--color-citrus)" : "rgba(126,12,4,0.08)",
        color: isPositive ? "var(--color-moss)" : "var(--color-red)",
        whiteSpace: "nowrap",
      }}
    >
      {isPositive ? "↓" : "↑"} {Math.abs(percent).toFixed(0)}%
    </span>
  );
}
