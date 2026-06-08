import { useEffect } from "react";
import "./SupermanFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

/** SupermanFlow.css の supermanFlight 90s と揃える */
const FLOW_DURATION_MS = 90000;

export default function SupermanFlow({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, FLOW_DURATION_MS);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="superman-flow">
            <img
                src={`${publicUrl}/assets/ocean_image/collections/superman.png`}
                alt="Superman"
                className="superman"
            />
        </div>
    );
}
