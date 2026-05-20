// FuturisticCarFlow.jsx
import { useEffect } from "react";
import "./FuturisticCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function FuturisticCarFlow({ onComplete }) {
    useEffect(() => {
        // アニメーション全体の時間（11秒）と完全に同期させてonCompleteを呼び出す
        const futuristicCarTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 11000);

        return () => {
            clearTimeout(futuristicCarTimer);
        };
    }, [onComplete]);

    return (
        <div className="futuristic-car-flow">
            {/* 既存の構造を維持し、移動アニメーションをこのラッパーに適用 */}
            <div className="futuristic-car-body">
                <img
                    src={`${publicUrl}/assets/ocean_image/collections/futuristic_car.png`}
                    alt="futuristic car"
                    className="futuristic-car-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}