import { useEffect } from "react";
import "./VintageCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function VintageCarFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 12000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="vintage-car-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/vintage_car.png`}
        alt="vintage car"
        className="vintage-car-image"
      />
    </div>
  );
}