import { useEffect } from "react";
import "./PassingVehicle.css";

const PASS_DURATION_MS = 12000;

export default function PassingVehicle({ image, onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) {
                onComplete();
            }
        }, PASS_DURATION_MS);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!image) return null;

    return (
        <img
            src={image}
            className="passing-car"
            alt="passing car"
            draggable="false"
        />
    );
}