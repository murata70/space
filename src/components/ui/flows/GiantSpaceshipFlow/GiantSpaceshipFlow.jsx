import { useEffect } from "react";
import "./GiantSpaceshipFlow.css";

export default function GiantSpaceshipFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 7000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow ship-flow">
      <img src="/assets/image/collections/giant_spaceship.png" />
    </div>
  );
}