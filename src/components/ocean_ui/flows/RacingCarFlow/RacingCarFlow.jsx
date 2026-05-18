import { useEffect } from "react";
import "./RacingCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function RacingCarFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="racing-car-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/racing_car.png`}
        alt="racing car"
        className="racing-car-image"
      />
    </div>
  );
}