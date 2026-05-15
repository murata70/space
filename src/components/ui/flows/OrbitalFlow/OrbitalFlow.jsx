import { useEffect, useState } from "react";
import "./OrbitalFlow.css";

export default function OrbitalFlow({ onComplete }) {
    // 人工衛星の高度（高さ）をランダムに決定
    const [satelliteTop, setSatelliteTop] = useState("40%");

    useEffect(() => {
        // 下4分の1を避け、上端に寄りすぎない 5% 〜 65% の範囲でランダム設定
        const min = 5;
        const max = 65;
        const randomPos = Math.floor(Math.random() * (max - min + 1)) + min;
        setSatelliteTop(`${randomPos}%`);

        // 35秒（CSSのアニメーション時間と同期）後に終了通知
        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, 35000);

        return () => {
            clearTimeout(timer);
        };
    }, [onComplete]);

    return (
        <div className="orbital-flow-wrapper">
            <img
                src="/assets/image/collections/orbital.png"
                alt="Orbital Satellite"
                className="orbital-flow-unit"
                style={{ top: satelliteTop }}
                draggable="false"
            />
        </div>
    );
}