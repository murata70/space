import { useEffect } from "react";
import "./AstronautFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function AstronautFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 20000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="astronaut-flow-wrapper">
      <div className="astronaut-flow-stage">
        <img
          src={`${publicUrl}/assets/image/collections/astronaut.png`}
          className="astronaut-flow-image"
          alt="astronaut"
        />
      </div>
    </div>
  );
}