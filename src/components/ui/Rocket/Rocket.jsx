// space/src/components/ui/Rocket/Rocket.jsx

import { useEffect, useState, useRef } from "react";
import "./Rocket.css";

const normalEffects = [
    "assets/image/rocket/engine_effect_normal1.png",
    "assets/image/rocket/engine_effect_normal2.png",
];

const turboEffects = [
    "assets/image/rocket/engine_effect_turbo1.png",
    "assets/image/rocket/engine_effect_turbo2.png",
];

export default function Rocket() {
    const publicUrl = process.env.PUBLIC_URL || "";
    const [boosting, setBoosting] = useState(false);
    const [showNormal, setShowNormal] = useState(true);
    const [frame, setFrame] = useState(0);
    const boostTimeout = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % 2);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleBoostStart = () => {
        clearTimeout(boostTimeout.current);
        setBoosting(true);
        setShowNormal(false);
        window.electron?.setIgnoreMouse?.(false);
        window.electron?.beginRocketInteraction?.();
    };

    const handleBoostEnd = () => {
        setBoosting(false);
        boostTimeout.current = setTimeout(() => {
            setShowNormal(true);
        }, 200);
        window.electron?.endRocketInteraction?.();
    };

    const handlePointerDown = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        handleBoostStart();
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
    };

    const handlePointerUp = (e) => {
        handleBoostEnd();
        try {
            if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
        } catch {
            /* ignore */
        }
    };

    const handlePointerLeave = () => {
        if (!boosting) return;
        handleBoostEnd();
    };

    const handlePointerEnter = () => {
        window.electron?.setIgnoreMouse?.(false);
    };

    return (
        <div className="rocket-position">
            <div
                className={`rocket-wrapper${boosting ? " boosting" : ""}`}
                onPointerEnter={handlePointerEnter}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerUp}
            >
                <div className="engine-box">
                    {boosting && (
                        <img
                            src={`${publicUrl}/${turboEffects[frame]}`}
                            alt="turbo"
                            className="engine-effect turbo"
                            draggable="false"
                        />
                    )}

                    {!boosting && showNormal && (
                        <img
                            src={`${publicUrl}/${normalEffects[frame]}`}
                            alt="normal"
                            className="engine-effect"
                            draggable="false"
                        />
                    )}
                </div>

                <img
                    src={`${publicUrl}/assets/image/rocket/rocket1.png`}
                    alt="rocket"
                    className="rocket-image"
                    draggable="false"
                    onError={(e) => {
                        e.currentTarget.src = `${publicUrl}/assets/image/rocket/rocket 1.png`;
                    }}
                />
            </div>
        </div>
    );
}
