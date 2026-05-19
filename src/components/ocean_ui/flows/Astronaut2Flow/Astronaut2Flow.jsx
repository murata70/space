import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./Astronaut2Flow.css";

const publicUrl = process.env.PUBLIC_URL || "";

const FLOW_DURATION_MS = 42000;

export default function Astronaut2Flow({ onComplete }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, FLOW_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const flow = (
    <div className="astronaut2-flow">
      <div className="astronaut2-dark" aria-hidden="true" />
      <div className="astronaut2-sparkle" aria-hidden="true" />
      <div className="astronaut2-stage">
        <div className="astronaut2-sway">
          <img
            src={`${publicUrl}/assets/ocean_image/collections/astronaut2.png`}
            alt="astronaut2"
            className="astronaut2-image"
          />
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(flow, document.body);
}
