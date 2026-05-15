import { useEffect, useRef, useState } from "react";
import "./ZodiacFlow.css";

export default function ZodiacFlow({ onComplete }) {
  const wrapperRef = useRef(null);

  const zodiacImages = [
    "/assets/image/collections/aquarius.png",
    "/assets/image/collections/aries.png",
    "/assets/image/collections/cancer.png",
    "/assets/image/collections/capricorn.png",
    "/assets/image/collections/gemini.png",
    "/assets/image/collections/leo.png",
    "/assets/image/collections/libra.png",
    "/assets/image/collections/pisces.png",
    "/assets/image/collections/scorpio.png",
    "/assets/image/collections/taurus.png",
    "/assets/image/collections/virgo.png",
    "/assets/image/collections/sagittarius.png",
  ];

  const [img, setImg] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState("in");

  useEffect(() => {
    const selected =
      zodiacImages[Math.floor(Math.random() * zodiacImages.length)];
    setImg(selected);

    const margin = 180;
    const x = Math.random() * (window.innerWidth - margin * 2) + margin;
    const y = Math.random() * (window.innerHeight - margin * 2) + margin;

    setPos({ x, y });

    const timers = [];

    // 5秒フェードイン
    timers.push(setTimeout(() => setPhase("stay"), 5000));

    // 25秒滞在後フェードアウト開始
    timers.push(setTimeout(() => setPhase("out"), 30000));

    // 完了
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