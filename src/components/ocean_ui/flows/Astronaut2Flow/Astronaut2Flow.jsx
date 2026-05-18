import { useEffect } from "react";
import "./Astronaut2Flow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function Astronaut2Flow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 9000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="astronaut2-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/astronaut2.png`}
        alt="astronaut2"
        className="astronaut2-image"
      />
    </div>
  );
}