import { useEffect, useState } from "react";
import "./BlackHoleFlow.css";

const IMAGE = "/assets/image/collections/blackhole.png";

export default function BlackHoleFlow() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false);

      setTimeout(() => {
        setActive(true);
      }, 3000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (!active) return null;

  return (
    <div className="blackhole-layer">
      <img src={IMAGE} className="blackhole" />

      {/* ‹z‚¢ž‚Ý—±Žq */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="star" style={{ "--i": i }} />
      ))}
    </div>
  );
}