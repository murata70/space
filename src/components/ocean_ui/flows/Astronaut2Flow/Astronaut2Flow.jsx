import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Astronaut2Flow.css";

const publicUrl = process.env.PUBLIC_URL || "";

const FLOW_DURATION_MS = 49000;
// astronaut2Approach の delay / duration / 右下移動開始(70%) と同期
const APPROACH_DELAY_MS = 1150;
const APPROACH_DURATION_MS = 45000;
const EXIT_START_RATIO = 0.7;
const OFFSCREEN_AREA_RATIO = 0.8;

export default function Astronaut2Flow({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [ended, setEnded] = useState(false);
  const imgRef = useRef(null);
  const completedRef = useRef(false);

  const finishFlow = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setEnded(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(finishFlow, FLOW_DURATION_MS);
    return () => clearTimeout(timer);
  }, [finishFlow]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    let exitPhase = false;
    const exitEnableTimer = setTimeout(() => {
      exitPhase = true;
    }, APPROACH_DELAY_MS + APPROACH_DURATION_MS * EXIT_START_RATIO);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!exitPhase || completedRef.current) return;
        const visibleRatio = entry.intersectionRatio;
        if (visibleRatio <= 1 - OFFSCREEN_AREA_RATIO) {
          finishFlow();
        }
      },
      { threshold: [0, 0.1, 0.2, 0.25, 0.5, 0.75, 1] }
    );

    observer.observe(img);

    return () => {
      clearTimeout(exitEnableTimer);
      observer.disconnect();
    };
  }, [mounted, finishFlow]);

  const flow = (
    <div
      className={`astronaut2-flow${ended ? " astronaut2-flow--ended" : ""}`}
    >
      <div className="astronaut2-dark" aria-hidden="true" />
      <div className="astronaut2-sparkle" aria-hidden="true" />
      <div className="astronaut2-stage">
        <div className="astronaut2-sway">
          <img
            ref={imgRef}
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
