import { useEffect } from "react";
import "./MeteorShowerFlow.css";

export default function MeteorShowerFlow({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(() => onComplete?.(), 6000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="flow meteor-shower">
      <img src="/assets/image/collections/meteor1.png" />
      <img src="/assets/image/collections/meteor2.png" />
    </div>
  );
}