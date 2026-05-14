import { useEffect } from "react";
import "./AstronautFlow.css";

export default function AstronautFlow({ onComplete }) {

  useEffect(() => {
    const t = setTimeout(() => {
      onComplete?.();
    }, 6000);

    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow astronaut-flow">
      <img src="/assets/image/collections/astronaut.png" />
    </div>
  );
}