import klarnaLogo from "../../assets/Klarna.png";
import swishLogo from "../../assets/Swish.png";
import vippsLogo from "../../assets/Vipps.png";
import mobilepayLogo from "../../assets/MobilePay.png";

interface Props {
  icon: string;
  size?: number;
}

export default function MethodIcon({ icon, size = 42 }: Props) {
  const w = Math.round(size * 1.7);
  const tile: React.CSSProperties = {
    width: w,
    height: size,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
    background: "#fff",
    border: "0.5px solid rgba(2,44,18,0.10)",
    padding: "6px 8px",
  };

  if (icon === "card") {
    return (
      <div
        style={{
          ...tile,
          background: "var(--color-lichen)",
          color: "var(--color-moss)",
        }}
      >
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      </div>
    );
  }

  const map: Record<string, string> = {
    klarna: klarnaLogo,
    swish: swishLogo,
    vipps: vippsLogo,
    mobilepay: mobilepayLogo,
  };
  const src = map[icon];

  if (src) {
    // Klarna's pink ships hot on light surfaces and over-shouts the
    // citrus accent in the savings card. Slightly desaturate so the
    // logo still reads as Klarna without dominating the row.
    const filter = icon === "klarna" ? "saturate(0.78)" : undefined;
    return (
      <div style={tile}>
        <img
          src={src}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
            objectFit: "contain",
            filter,
          }}
        />
      </div>
    );
  }

  return <div style={tile}>?</div>;
}
