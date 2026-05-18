import { useEffect } from "react";
import "./SportsCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function SportsCarFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="sports-car-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/sports_car.png`}
        alt="sports car"
        className="sports-car-image"
      />
    </div>
  );
}