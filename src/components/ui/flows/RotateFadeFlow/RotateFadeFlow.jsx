import { useEffect, useState } from "react";
import "./RotateFadeFlow.css";

const IMAGE = "/assets/image/collections/astronaut.png";

export default function RotateFadeFlow() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey((p) => p + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rotate-layer">
      <img
        key={key}
        src={IMAGE}
        className="astronaut"
      />
    </div>
  );
}