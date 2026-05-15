import { useEffect, useState } from "react";
import "./MeteorShowerFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function MeteorShowerFlow({ onComplete }) {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      const fromTop = Math.random() < 0.5;

      const baseSize = 30 + Math.random() * 30;
      const size = baseSize * (1 + Math.random());

      const newMeteor = {
        id: Date.now() + Math.random(),

        x: fromTop
          ? Math.random() * window.innerWidth
          : window.innerWidth + 50,

        y: fromTop ? -120 : Math.random() * window.innerHeight,

        size,
        delay: Math.random() * 0.3,
      };

      setMeteors((prev) => [...prev, newMeteor]);
    }, 180); // š‡@ 250ms ¨ 180msi‚‘¬‰»j

    const stopTimer = setTimeout(() => {
      clearInterval(spawnInterval);
    }, 25000);

    const finishTimer = setTimeout(() => {
      onComplete?.();
    }, 27000);

    return () => {
      clearInterval(spawnInterval);
      clearTimeout(stopTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className="meteor-shower-flow">
      {/* š‡A ˆÃ“]ƒŒƒCƒ„[’Ç‰Á */}
      <div className="meteor-shower-dark" />

      {meteors.map((m) => (
        <div
          key={m.id}
          className="meteor-shower-item"
          style={{
            left: `${m.x}px`,
            top: `${m.y}px`,
            animationDelay: `${m.delay}s`,
          }}
        >
          <div className="meteor-shower-glow" />

          <img
            src={`${publicUrl}/assets/image/collections/ryuseigun.png`}
            className="meteor-shower-image"
            style={{
              width: `${m.size}px`,
              height: "auto",
            }}
            alt="meteor"
          />
        </div>
      ))}
    </div>
  );
}