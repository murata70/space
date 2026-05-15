import { useEffect, useState } from "react";
import "./MeteorFlow.css";

export default function MeteorFlow({ onComplete }) {
  const [meteor, setMeteor] = useState(null);

  useEffect(() => {
    spawnMeteor();

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const spawnMeteor = () => {
    const startX = Math.random() * window.innerWidth;
    const startY = -100;

    const angle = Math.random() * 360;

    setMeteor({
      id: Date.now(),
      startX,
      startY,
      angle,
    });
  };

  if (!meteor) return null;

  const { startX, startY, angle } = meteor;

  return (
    <div className="meteor-flow-wrapper">
      <img
        src="/assets/image/collections/meteor1.png"
        alt="meteor"
        className="meteor-image"
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
          "--meteor-angle": `${angle}deg`,
        }}
      />
    </div>
  );
}