// SupermanFlow.jsx
import { useEffect } from "react";
import "./SupermanFlow.css";

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
                src="/assets/image/collections/superman.png"
                alt="superman"
            />
        </div>
    );
}