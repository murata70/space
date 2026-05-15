import { useEffect, useMemo } from "react";
import "./MeteorShowerFlow.css"; // ©‚±‚±‚ðC³

export default function MeteorShowerFlow({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 40000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const meteors = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => {
      const size = 24 + Math.random() * 220;
      const duration = Math.max(3, 15 - size / 20);
      const fromLeftSide = Math.random() > 0.5;

      const left = fromLeftSide
        ? Math.random() * 40
        : 60 + Math.random() * 40;

      const top = Math.random() * 35;
      const delay = Math.random() * 30;

      let z = 4;
      if (size > 170) z = 6;
      else if (size > 100) z = 5;

      return {
        id: i,
        size,
        duration,
        top,
        left,
        delay,
        z,
      };
    });
  }, []);

  return (
    <div className="meteor-flow-wrap">
      <div className="meteor-flow-dark" />

      {meteors.map((m) => (
        <div
          key={m.id}
          className="meteor-flow-item"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            zIndex: m.z,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        >
          <div
            className="meteor-flow-glow"
            style={{
              width: `${m.size * 1.2}px`,
              height: `${m.size * 1.2}px`,
            }}
          />

          <img
            src="/assets/image/collections/ryuseigun.png"
            alt="meteor"
            className="meteor-flow-img"
            style={{ width: `${m.size}px` }}
            draggable="false"
          />
        </div>
      ))}
    </div>
  );
}