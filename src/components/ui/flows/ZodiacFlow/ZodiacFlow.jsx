import { useEffect } from "react";
import "./ZodiacFlow.css";

export default function ZodiacFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 6000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow zodiac-flow">
      <img src="/assets/image/collections/Aries.png" />
    </div>
  );
}