import { useEffect } from "react";
import "./GiantSpaceshipFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function GiantSpaceshipFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 25000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="giant-ship-flow">
      {/* ˆÃ“]ƒŒƒCƒ„[ */}
      <div className="giant-ship-dark" />

      {/* ‰F’ˆ‘D */}
      <div className="giant-ship-wrapper">
        <img
          src={`${publicUrl}/assets/image/collections/giant_spaceship.png`}
          className="giant-ship-image"
          alt="giant spaceship"
        />
      </div>
    </div>
  );
}