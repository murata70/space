// space/src/components/ui/Rocket/Rocket.jsx

import { useEffect, useState, useRef } from "react";
import "./Rocket.css";

const normalEffects = [
    "assets/image/rocket/engine_effect_normal1.png",
    "assets/image/rocket/engine_effect_normal2.png",
];

const turboEffects = [
    "assets/image/rocket/engine_effect_turbo1.png",
    "assets/image/rocket/engine_effect_turbo2.png",
];

export default function Rocket() {
    const publicUrl = process.env.PUBLIC_URL || "";

    // ブースト中
    const [boosting, setBoosting] = useState(false);

    // 通常炎表示
    const [showNormal, setShowNormal] = useState(true);

    // 炎切り替え
    const [frame, setFrame] = useState(0);

    const boostTimeout = useRef(null);

    // 炎アニメ
    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % 2);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // 長押し開始
    const handleBoostStart = () => {
        clearTimeout(boostTimeout.current);
        setBoosting(true);
        // 通常炎を消す
        setShowNormal(false);
    };

    // 長押し終了
    const handleBoostEnd = () => {
        // ターボ炎を即消す
        setBoosting(false);
        // 0.2秒後に通常炎表示
        boostTimeout.current = setTimeout(() => {
            setShowNormal(true);
        }, 200);
    };

    return (
        <div className="rocket-position">
            <div
                className="rocket-wrapper"
                onMouseDown={handleBoostStart}
                onMouseUp={handleBoostEnd}
                onMouseLeave={handleBoostEnd}
            >
                <div className="engine-box">
                    {/* ターボ炎 */}
                    {boosting && (
                        <img
                            src={`${publicUrl}/${turboEffects[frame]}`}
                            alt="turbo"
                            className="engine-effect turbo"
                        />
                    )}

                    {/* 通常炎 */}
                    {!boosting && showNormal && (
                        <img
                            src={`${publicUrl}/${normalEffects[frame]}`}
                            alt="normal"
                            className="engine-effect"
                        />
                    )}
                </div>

                {/* ロケット */}
                <img
                    src={`${publicUrl}/assets/image/rocket/rocket 1.png`}
                    alt="rocket"
                    className="rocket-image"
                    draggable="false"
                />
            </div>
        </div>
    );
}