// FuturisticCarFlow.jsx
import { useEffect } from "react";
import "./FuturisticCarFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function FuturisticCarFlow({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 9000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="futuristic-car-flow">
            {/* 移動アニメは .futuristic-car-body に付与。img 直付けだと transform が画像側で上書きされるためラッパーを挟む */}
            <div className="futuristic-car-body">
                <img
                    src={`${publicUrl}/assets/ocean_image/collections/futuristic_car.png`}
                    alt="futuristic car"
                    className="futuristic-car-image"
                />
            </div>
        </div>
    );
}
