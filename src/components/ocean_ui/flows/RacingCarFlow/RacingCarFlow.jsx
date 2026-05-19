// RacingCarFlow.jsx
import { useEffect } from "react";
import "./RacingCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function RacingCarFlow({ onComplete }) {
    useEffect(() => {
        // 既存の8000ms（8秒）のタイマー構造を維持して終了後に発火
        const timer = setTimeout(() => {
            onComplete?.();
        }, 8000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="racing-car-flow">
            {/* 意図しないアニメーションの上書きを回避するため、外枠を一枚挟んで位置制御します */}
            <div className="racing-car-body">
                {/* ステートを使わずCSSのディレイのみで0.1秒交互のエンジン駆動を見せるための並列配置コンテナ */}
                <div className="racing-car-container">
                    <img
                        src={`${publicUrl}/assets/ocean_image/collections/racing_car.png`}
                        alt="racing car engine active"
                        className="racing-car-image-a"
                    />
                    <img
                        src={`${publicUrl}/assets/ocean_image/collections/racing_car.png`}
                        alt="racing car engine pulse"
                        className="racing-car-image-b"
                    />
                </div>
            </div>
        </div>
    );
}