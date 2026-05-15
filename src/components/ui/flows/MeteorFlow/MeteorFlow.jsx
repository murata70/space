import { useEffect, useState } from "react";
import "./MeteorFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function MeteorFlow({ onComplete }) {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const items = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      startX: Math.random() * window.innerWidth,
      startY: -200,
      angle: Math.random() * 360,
    }));

    setMeteors(items);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 8000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="meteor-wrapper">
      {meteors.map((m) => (
        <img
          key={m.id}
          src={`${publicUrl}/assets/image/collections/meteor1.png`}
          className="meteor-image"
          alt="meteor"
          style={{
            left: `${m.startX}px`,
            top: `${m.startY}px`,
            "--meteor-angle": `${m.angle}deg`,
          }}
        />
      ))}
    </div>
  );
}