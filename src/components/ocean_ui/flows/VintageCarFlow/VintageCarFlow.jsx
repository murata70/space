// VintageCarFlow.jsx
import { useEffect } from "react";
import "./VintageCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function VintageCarFlow({ onComplete }) {
    useEffect(() => {
        // 速度はそのまま：ゆっくりと優雅に走行させるため、全体時間を18秒に維持
        const timer = setTimeout(() => {
            onComplete?.();
        }, 18000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="vintage-car-flow">
            <div className="vintage-car-body">
                <img
                    src={`${publicUrl}/assets/ocean_image/collections/vintage_car.png`}
                    alt="vintage car"
                    className="vintage-car-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}