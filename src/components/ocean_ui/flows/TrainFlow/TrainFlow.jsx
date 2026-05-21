import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const publicUrl = process.env.PUBLIC_URL || "";

export default function TrainFlow({ onComplete = () => {} }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const duration = 12000; // 少しゆっくり
    const width = window.innerWidth;

    // 画面外スタート → 画面外終了
    const startX = -3000;
    const endX = width + 2000;

    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);

      const x = startX + (endX - startX) * progress;

      // 👇上下ゆれ（かなり緩やか）
      const y = Math.sin(time / 180) * 10;

      el.style.transform = `
        translate(${x}px, ${y}px)
        scale(25)
      `;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        finish();
      }
    };

    requestAnimationFrame(animate);
  }, [finish]);

  if (!mounted) return null;

  const flow = (
    <div
      style={{
        position: "fixed",
        inset: 0,

        // ★植木(background_road2)より確実に上
        zIndex: 999999999,

        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <img
        ref={ref}
        src={`${publicUrl}/assets/ocean_image/collections/train.png`}
        alt="train"
        draggable={false}
        style={{
          position: "fixed",

          // ★最下部（少し見切れ）
          bottom: "-60px",

          left: 0,

          width: "200px",
          height: "auto",

          transformOrigin: "center bottom",
          willChange: "transform",
        }}
      />
    </div>
  );

  return createPortal(flow, document.body);
}