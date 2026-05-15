// SupermanFlow.jsx
import { useEffect } from "react";
import "./SupermanFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function SupermanFlow({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 85000);

        return () => {
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="superman-flow-wrapper">
            <img
                className="superman-flow-image"
                src={`${publicUrl}/assets/image/collections/superman.png`}
                alt="superman"
            />
        </div>
    );
}