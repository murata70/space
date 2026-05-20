// SportsCarFlow.jsx
import { useEffect } from "react";
import "./SportsCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function SportsCarFlow({ onComplete }) {
    useEffect(() => {
        // 走行速度をゆっくりにするため、アニメーション全体の時間を12秒に延長・同期
        const sportsCarTimer = setTimeout(() => {
            onComplete?.();
        }, 12000);

        return () => clearTimeout(sportsCarTimer);
    }, [onComplete]);

    return (
        <div className="sports-car-flow">
            <div className="sports-car-body">
                <img
                    src={`${publicUrl}/assets/ocean_image/collections/sports_car.png`}
                    alt="sports car"
                    className="sports-car-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}