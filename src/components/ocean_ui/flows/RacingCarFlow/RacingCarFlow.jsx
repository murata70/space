// RacingCarFlow.jsx
import { useEffect } from "react";
import "./RacingCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function RacingCarFlow({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 8000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="racing-car-flow">
            <div className="racing-car-body">

                {/* スピードライン */}
                <div className="racing-speed-lines">
                    <span />
                    <span />
                    <span />
                </div>

                {/* 車 */}
                <div className="racing-car-container">
                    <img
                        src={`${publicUrl}/assets/ocean_image/collections/racing_car.png`}
                        alt="racing car"
                        className="racing-car-image"
                    />
                </div>
            </div>
        </div>
    );
}