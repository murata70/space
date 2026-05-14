import { useEffect } from "react";
import "./SupermanFlow.css";

export default function SupermanFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 5000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow superman-flow">
      <img src="/assets/image/collections/superman.png" />
    </div>
  );
}