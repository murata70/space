import { useEffect } from "react";
import "./GiantSpaceshipFlow.css";

export default function GiantSpaceshipFlow({ onComplete }) {
    const publicUrl = process.env.PUBLIC_URL || "";

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 25000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="giant-ship-flow-wrap">
            <div className="giant-ship-dark-overlay" />

            <div className="giant-ship-body">
                <img
                    src="/assets/image/collections/giant_spaceship.png"
                    alt="giant spaceship"
                    className="giant-ship-image"
                />
            </div>
        </div>
    );
}