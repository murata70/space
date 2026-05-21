import { useEffect, useRef, useState } from "react";
import "./ZodiacFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function ZodiacFlow({ onComplete }) {
    const zodiacImages = [
        `${publicUrl}/assets/image/collections/aquarius.png`,
        `${publicUrl}/assets/image/collections/aries.png`,
        `${publicUrl}/assets/image/collections/cancer.png`,
        `${publicUrl}/assets/image/collections/capricorn.png`,
        `${publicUrl}/assets/image/collections/gemini.png`,
        `${publicUrl}/assets/image/collections/leo.png`,
        `${publicUrl}/assets/image/collections/libra.png`,
        `${publicUrl}/assets/image/collections/pisces.png`,
        `${publicUrl}/assets/image/collections/scorpio.png`,
        `${publicUrl}/assets/image/collections/taurus.png`,
        `${publicUrl}/assets/image/collections/virgo.png`,
        `${publicUrl}/assets/image/collections/sagittarius.png`,
    ];

    const imgRef = useRef(null);
    const posRef = useRef(null);

    const [img, setImg] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [phase, setPhase] = useState("in");

    useEffect(() => {
        if (!imgRef.current) {
            imgRef.current =
                zodiacImages[Math.floor(Math.random() * zodiacImages.length)];

            const margin = 180;

            posRef.current = {
                x: Math.random() * (window.innerWidth - margin * 2) + margin,
                y: Math.random() * (window.innerHeight - margin * 2) + margin,
            };
        }

        setImg(imgRef.current);
        setPos(posRef.current);

        const timers = [];
        timers.push(setTimeout(() => setPhase("stay"), 5000));
        timers.push(setTimeout(() => setPhase("out"), 30000));
        timers.push(setTimeout(() => onComplete?.(), 35000));

        return () => timers.forEach(clearTimeout);
    }, []); // ← 絶対これだけ

    if (!img) return null;

    return (
        <div className="zodiac-flow-wrapper">
            <div
                className={`zodiac-flow-image zodiac-flow-${phase}`}
                style={{
                    left: pos.x,
                    top: pos.y,
                }}
            >
                <img src={img} alt="zodiac" />
            </div>
        </div>
    );
}