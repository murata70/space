import { useEffect, useRef, useState } from "react";
import "./BlackHoleFlow.css";

export default function BlackHoleFlow({ onComplete }) {
    const publicUrl = process.env.PUBLIC_URL || "";

    const [phase, setPhase] = useState("in");

    const posRef = useRef(null);

    if (!posRef.current) {
        posRef.current = {
            x: Math.random() * 50 + 25,
            y: Math.random() * 50 + 25,
        };
    }

    useEffect(() => {
        const t1 = setTimeout(() => setPhase("active"), 3000);
        const t2 = setTimeout(() => setPhase("out"), 23000);
        const t3 = setTimeout(() => setPhase("end"), 26000);
        const t4 = setTimeout(() => onComplete?.(), 29000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    }, [onComplete]);

    if (phase === "end") return null;

    return (
        <div className={`blackhole-wrap blackhole-${phase}`}>
            <div className="blackhole-dark" />

            <div
                className="blackhole-core"
                style={{
                    left: `${posRef.current.x}vw`,
                    top: `${posRef.current.y}vh`,
                }}
            >
                <img
                    src={`${publicUrl}/assets/image/collections/blackhole.png`}
                    className="blackhole-image"
                    alt="blackhole"
                />

                <div className="blackhole-aura" />
            </div>
        </div>
    );
}