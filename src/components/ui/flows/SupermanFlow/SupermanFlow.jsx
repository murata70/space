import { useEffect } from "react";
import "./SupermanFlow.css";

const publicUrl = process.env.PUBLIC_URL || "";

export default function SupermanFlow() {
    return (
        <div className="superman-flow">
            <img
                src={`${publicUrl}/assets/image/collections/superman.png`}
                alt="Superman"
                className="superman"
            />
        </div>
    );
}