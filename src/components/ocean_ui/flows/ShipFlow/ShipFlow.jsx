import { useEffect } from "react";
import "./ShipFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ShipFlow({ onComplete }) {

    return (
        <div
            className="ship-flow"
            onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) {
                    onComplete?.();
                }
            }}
        >
            <img
                src={`${publicUrl}/assets/ocean_image/collections/ship.png`}
                alt="ship"
                className="ship-image"
            />
        </div>
    );
}