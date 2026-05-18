import { useEffect, useState } from "react";
import "./MeteorFlow.css";

export default function MeteorFlow({ onComplete }) {
    const publicUrl = process.env.PUBLIC_URL || "";

    const meteorImages = [
        `${publicUrl}/assets/image/collections/meteor1.png`,
        `${publicUrl}/assets/image/collections/meteor2.png`,
    ];

    const [meteorIndex, setMeteorIndex] = useState(0);

    useEffect(() => {
        const switchTimer = setInterval(() => {
            setMeteorIndex((prev) => (prev === 0 ? 1 : 0));
        }, 350);

        const completeTimer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 20000);

        return () => {
            clearInterval(switchTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className="meteor-flow-wrap">
            <div className="meteor-flow-body">
                <div className="meteor-flow-flame" />

                <img
                    src={meteorImages[meteorIndex]}
                    alt="meteor"
                    className="meteor-flow-image"
                />
            </div>
        </div>
    );
}