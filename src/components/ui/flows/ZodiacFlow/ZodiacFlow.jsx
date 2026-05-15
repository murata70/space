import { useEffect, useRef, useState } from "react";
import "./ZodiacFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ZodiacFlow({ onComplete }) {
  const wrapperRef = useRef(null);

  const zodiacImages = [
    `${publicUrl}/assets/image/collections/aquarius.png`,
    `${publicUrl}/assets/image/collections/aries.png`,
    `${publicUrl}/assets/image/collections/cancer.png`,
    `${publicUrl}/assets/image/collections/capricorn.png`,
    `${publicUrl}/assets/image/collections/gemini.png`,
    `${publicUrl}/assets/image/collections/leo.png`,
    `${publicUrl}/assets/image/collections/libra.png`,
    `${publicUrl}/assets/image/collections/pisces.png`,
    `${publicUrl}/assets/image/collections/scorpio.png`,
    `${publicUrl}/assets/image/collections/taurus.png`,
    `${publicUrl}/assets/image/collections/virgo.png`,
    `${publicUrl}/assets/image/collections/sagittarius.png`,
  ];

  const [img, setImg] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const selected =
      zodiacImages[Math.floor(Math.random() * zodiacImages.length)];

    setImg(selected);

    const margin = 180;

    const x =
      Math.random() * (window.innerWidth - margin * 2) + margin;

    const y =
      Math.random() * (window.innerHeight - margin * 2) + margin;

    setPos({ x, y });

    const timers = [];

    timers.push(setTimeout(() => setPhase("stay"), 5000));
    timers.push(setTimeout(() => setPhase("out"), 30000));
    timers.push(setTimeout(() => onComplete?.(), 35000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  if (!img) return null;

  return (
    <div className="zodiac-flow-wrapper" ref={wrapperRef}>
      <div
        className={`zodiac-flow-image zodiac-flow-${phase}`}
        style={{
          left: pos.x,
          top: pos.y,
        }}
      >
        <img src={img} alt="zodiac" />
      </div>
    </div>
  );
}