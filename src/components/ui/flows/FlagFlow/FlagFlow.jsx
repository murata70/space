import { useEffect } from "react";
import "./FlagFlow.css";

export default function FlagFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 5500);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow flag-flow">
      <img src="/assets/image/collections/flag.png" />
    </div>
  );
}