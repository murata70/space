import { useEffect, useState } from "react";
import "./FloatFlow.css";

export default function FloatFlow({ image }) {
  const [pos, setPos] = useState({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPos({
        x: pos.x + (Math.random() - 0.5) * 50,
        y: pos.y + (Math.random() - 0.5) * 30,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [pos]);

  return (
    <img
      src={`/assets/image/collections/${image}`}
      className="float-item"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    />
  );
}