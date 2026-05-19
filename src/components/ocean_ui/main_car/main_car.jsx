import { useEffect, useRef, useState } from "react";
import "./main_car.css";

const publicUrl = process.env.PUBLIC_URL || "";

const carFrames = [
    `${publicUrl}/assets/ocean_image/main_car/main_car1.png`,
    `${publicUrl}/assets/ocean_image/main_car/main_car2.png`,
];

const LONG_PRESS_MS = 500;

export default function MainCar() {
    const [frame, setFrame] = useState(0);
    const [dashPhase, setDashPhase] = useState("idle");

    const longPressTimer = useRef(null);
    const isDashing = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % 2);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const clearLongPressTimer = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const startDash = () => {
        if (isDashing.current) return;
        isDashing.current = true;
        setDashPhase("exit-right");
    };

    const handlePointerDown = (e) => {
        if (isDashing.current) return;
        if (e.button !== undefined && e.button !== 0) return;

        clearLongPressTimer();
        longPressTimer.current = setTimeout(startDash, LONG_PRESS_MS);
    };

    const handlePointerUp = () => {
        clearLongPressTimer();
    };

    const handlePointerLeave = () => {
        clearLongPressTimer();
    };

    const handleAnimationEnd = (e) => {
        if (e.target !== e.currentTarget) return;

        setDashPhase((phase) => {
            if (phase === "exit-right") return "enter-from-left";
            if (phase === "enter-from-left") {
                isDashing.current = false;
                return "idle";
            }
            return phase;
        });
    };

    const wrapperClassName = [
        "main-car-wrapper",
        dashPhase === "exit-right" && "dash-exit",
        dashPhase === "enter-from-left" && "dash-enter",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="main-car-position">
            <div
                className={wrapperClassName}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerLeave}
                onPointerCancel={handlePointerUp}
                onAnimationEnd={handleAnimationEnd}
            >
                <img
                    src={carFrames[frame]}
                    alt="main car"
                    className="main-car-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}
