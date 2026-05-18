import { useEffect, useState } from "react";
import "./AstronautFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function AstronautFlow({ onComplete }) {
  const [shine, setShine] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShine(true);
    }, 19500);

    const timer2 = setTimeout(() => {
      setShine(false);
      if (onComplete) onComplete();
    }, 20000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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

      {shine && <div className="astronaut-shine-star" />}
    </div>
  );
}