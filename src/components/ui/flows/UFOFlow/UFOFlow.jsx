import { useEffect } from "react";
import "./UFOFlow.css";

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
        src="/assets/image/collections/ufo.png"
        alt="ufo"
        className="ufo-image"
      />
    </div>
  );
}