import React, { useEffect } from "react";
import "./CarriageFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

/** 馬車が画面を横断する時間（CarriageFlow.css の carriageMove 12s と揃える） */
const FLOW_DURATION_MS = 12000;

/**
 * コレクション「馬車」演出。
 * carriage.png が道路レーン上を右端から左へ走り抜け、終了後に onComplete で次へ進む。
 * 位置・揺れ・移動のアニメーションは CarriageFlow.css で制御（ocean_layout.css 非依存）。
 */
export default function CarriageFlow({ onComplete }) {
  // 横断アニメーション完了後に親へ完了通知
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, FLOW_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="carriage-flow">
      <img
        src={`${publicUrl}/assets/ocean_image/collections/carriage.png`}
        alt="carriage"
        className="carriage-image"
      />
    </div>
  );
}
