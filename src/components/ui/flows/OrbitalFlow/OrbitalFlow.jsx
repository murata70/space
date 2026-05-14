import { useEffect } from "react";
import "./OrbitalFlow.css";

export default function OrbitalFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 6000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow orbital-flow">
      <img src="/assets/image/collections/orbital.png" />
    </div>
  );
}