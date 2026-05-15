import { useEffect } from "react";
import "./BlackHoleFlow.css";

export default function BlackHoleFlow({ onComplete }) {
    useEffect(() => {
        const t = setTimeout(() => onComplete?.(), 5000);
        return () => clearTimeout(t);
    }, [onComplete]);

    const publicUrl = process.env.PUBLIC_URL || "";

    return (
        <div className="flow blackhole-flow">
            <img src={`${publicUrl}/assets/image/collections/blackhole.png`} />
        </div>
    );
}