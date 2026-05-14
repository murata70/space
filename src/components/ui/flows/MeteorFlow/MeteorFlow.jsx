import { useEffect, useMemo, useState } from "react";
import "./MeteorFlow.css";

const meteorFrames = [
  "/assets/image/collections/meteor1.png",
  "/assets/image/collections/meteor2.png",
];

export default function MeteorFlow({ onComplete }) {

  // ランダム開始位置
  const startX = useMemo(() => {
    return window.innerWidth + Math.random() * 300;
  }, []);

  const startY = useMemo(() => {
    return -100 - Math.random() * 200;
  }, []);

  // ランダム角度
  const angle = useMemo(() => {
    return 25 + Math.random() * 25;
  }, []);

  // 画像切り替え
  const [frame, setFrame] = useState(0);

  useEffect(() => {

    const frameTimer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 2);
    }, 80);

    return () => clearInterval(frameTimer);

  }, []);

  useEffect(() => {

    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);

  }, [onComplete]);

  return (
    <div className="meteor-flow">

      <img
        src={meteorFrames[frame]}
        alt="meteor"
        className="meteor-image"
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
          "--meteor-angle": `${angle}deg`,
        }}
      />

    </div>
  );
}