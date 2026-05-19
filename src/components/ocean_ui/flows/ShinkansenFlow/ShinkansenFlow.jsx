import { useEffect } from "react";
import "./ShinkansenFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ShinkansenFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="shinkansen-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/shinkansen.png`}
        alt="shinkansen"
        className="shinkansen-image"
      />
    </div>
  );
}