import { useEffect } from "react";
import "./ShipFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ShipFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 17000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="ship-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/ship.png`}
        alt="ship"
        className="ship-image"
      />
    </div>
  );
}