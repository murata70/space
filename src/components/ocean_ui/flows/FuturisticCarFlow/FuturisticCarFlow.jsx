import { useEffect } from "react";
import "./FuturisticCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function FuturisticCarFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 7000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="futuristic-car-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/futuristic_car.png`}
        alt="futuristic car"
        className="futuristic-car-image"
      />
    </div>
  );
}