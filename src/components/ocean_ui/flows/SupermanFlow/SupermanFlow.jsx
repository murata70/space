import { useEffect } from "react";
import "./SupermanFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function SupermanFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 9000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="superman-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/superman.png`}
        alt="superman"
        className="superman-image"
      />
    </div>
  );
}