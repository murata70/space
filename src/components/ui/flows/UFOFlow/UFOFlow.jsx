import { useEffect } from "react";
import "./UFOFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function UFOFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="ufo-flow">
      <img
        src={`${publicUrl}/assets/image/collections/ufo.png`}
        alt="ufo"
        className="ufo-image"
      />
    </div>
  );
}