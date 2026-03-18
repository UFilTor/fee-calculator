import klarnaLogo from "../../assets/Klarna.png";
import swishLogo from "../../assets/Swish.png";
import vippsLogo from "../../assets/Vipps.png";
import mobilepayLogo from "../../assets/MobilePay.png";

interface Props {
  icon: string;
}

const SIZE = "flex h-8 w-12 items-center justify-center rounded overflow-hidden";

export default function MethodIcon({ icon }: Props) {
  switch (icon) {
    case "card":
      return (
        <div className={`${SIZE} bg-gray-100 text-gray-500`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
      );
    case "klarna":
      return (
        <div className={`${SIZE} bg-white`}>
          <img src={klarnaLogo} alt="Klarna" className="h-6 w-auto object-contain" />
        </div>
      );
    case "swish":
      return (
        <div className={`${SIZE} bg-white`}>
          <img src={swishLogo} alt="Swish" className="h-6 w-auto object-contain" />
        </div>
      );
    case "vipps":
      return (
        <div className={`${SIZE} bg-white`}>
          <img src={vippsLogo} alt="Vipps" className="h-6 w-auto object-contain" />
        </div>
      );
    case "mobilepay":
      return (
        <div className={`${SIZE} bg-white`}>
          <img src={mobilepayLogo} alt="MobilePay" className="h-6 w-auto object-contain" />
        </div>
      );
    default:
      return (
        <div className={`${SIZE} bg-gray-100 text-gray-400`}>
          ?
        </div>
      );
  }
}
