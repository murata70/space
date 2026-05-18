import { useEffect } from "react";
import "./TrainFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function TrainFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 11000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="train-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/train.png`}
        alt="train"
        className="train-image"
      />
    </div>
  );
}