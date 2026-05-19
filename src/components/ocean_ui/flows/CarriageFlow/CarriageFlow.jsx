import React, { useEffect } from "react";
import "./CarriageFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function CarriageFlow({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete?.();
        }, 10000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="carriage-flow">
            <img
                src={`${publicUrl}/assets/ocean_image/collections/carriage.png`}
                alt="carriage"
                className="carriage-image"
            />
        </div>
    );
}