import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import "./ShinkansenFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ShinkansenFlow({ onComplete = () => {} }) {
  const ref = useRef(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const baseDuration = 12000;
    const duration = baseDuration / 2.3;

    const width = window.innerWidth;

    // 🚄 ★出現を完全に画面外へ
    const startX = -2000 - 400;

    // 🚄 ★消失も完全に画面外へ
    const endX = width + 2000 + 400 + el.offsetWidth;

    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);

      const x = startX + (endX - startX) * progress;

      // 🔒 高さ・動きは一切変更なし
      el.style.transform = `
        translate(${x}px, -20px)
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

  return createPortal(
    <div className="shinkansen-layer">
      <img
        ref={ref}
        src={`${publicUrl}/assets/ocean_image/collections/shinkansen.png`}
        alt="shinkansen"
        draggable={false}
        className="shinkansen-img"
      />
    </div>,
    document.body
  );
}