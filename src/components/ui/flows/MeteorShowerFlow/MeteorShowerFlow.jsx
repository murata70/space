import { useEffect, useState } from "react";
import "./MeteorShowerFlow.css";

const IMAGE = "/assets/image/collections/meteor_shower.png";

const COUNT = 10;

const createMeteor = () => ({
  id: Math.random(),
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 2,
  rotate: Math.random() * 360,
  size: 30 + Math.random() * 40,
});

export default function MeteorShowerFlow() {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const list = Array.from({ length: COUNT }, createMeteor);
    setMeteors(list);

    const timer = setInterval(() => {
      setMeteors(Array.from({ length: COUNT }, createMeteor));
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="meteor-layer">
      {meteors.map((m) => (
        <img
          key={m.id}
          src={IMAGE}
          className="meteor"
          style={{
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            width: `${m.size}px`,
            transform: `rotate(${m.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}