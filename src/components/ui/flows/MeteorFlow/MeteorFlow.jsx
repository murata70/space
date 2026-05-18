import { useEffect, useState } from "react";
import "./MeteorFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function MeteorFlow({ onComplete }) {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const newMeteor = {
        id: Date.now() + Math.random(),

        // š‰Eã‚©‚ço‚·
        x: Math.random() * window.innerWidth,
        y: -100,

        size: 30 + Math.random() * 40,
        delay: Math.random() * 0.3,
      };

      setMeteors((prev) => [...prev, newMeteor]);
    }, 200);

    const stopTimer = setTimeout(() => {
      clearInterval(spawnInterval);
    }, 20000);

    const finishTimer = setTimeout(() => {
      onComplete?.();
    }, 22000);

    return () => {
      clearInterval(spawnInterval);
      clearTimeout(stopTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="meteor-flow">
      {meteors.map((m) => (
        <div
          key={m.id}
          className="meteor-item"
          style={{
            left: `${m.x}px`,
            top: `${m.y}px`,
            animationDelay: `${m.delay}s`,
          }}
        >
          <img
            src={`${publicUrl}/assets/image/collections/meteor1.png`}
            className="meteor-image"
            style={{ width: `${m.size}px` }}
            alt="meteor"
          />
        </div>
      ))}
    </div>
  );
}