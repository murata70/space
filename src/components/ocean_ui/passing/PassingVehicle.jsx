import { useEffect } from "react";
import "./PassingVehicle.css";

const PASS_DURATION_MS = 12000;

export default function PassingVehicle({
  image,
  onComplete,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, PASS_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!image) return null;

  return (
    <div className="passing-wrapper">
      <img
        src={image}
        className="passing-car"
        alt="passing car"
        draggable="false"
      />
    </div>
  );
}
