import { useEffect, useRef, useState } from "react";
import "./ZodiacFlow.css";
import { getZodiacImageUrl, pickRandomZodiacSign } from "../../../../data/zodiacCatalog";
import { recordZodiacObservation } from "../../../../utils/zodiacObservationStorage";

export default function ZodiacFlow({ onComplete }) {
    const signRef = useRef(null);
    const posRef = useRef(null);

    const [img, setImg] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [phase, setPhase] = useState("in");

    useEffect(() => {
        if (!signRef.current) {
            const sign = pickRandomZodiacSign();
            signRef.current = sign;
            recordZodiacObservation(sign.id);

            const margin = 180;

            posRef.current = {
                x: Math.random() * (window.innerWidth - margin * 2) + margin,
                y: Math.random() * (window.innerHeight - margin * 2) + margin,
            };
        }

        setImg(getZodiacImageUrl(signRef.current));
        setPos(posRef.current);

        const timers = [];
        timers.push(setTimeout(() => setPhase("stay"), 5000));
        timers.push(setTimeout(() => setPhase("out"), 30000));
        timers.push(setTimeout(() => onComplete?.(), 35000));

        return () => timers.forEach(clearTimeout);
    }, []);

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