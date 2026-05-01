// 修正中
import React, { useEffect, useState } from "react";
import "./Wallpaper.css";

//テストです

const Wallpaper = () => {
    const [time, setTime] = useState("");
    const [showSettings, setShowSettings] = useState(false);

    // 時計（モックでも動かすと雰囲気出る）
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const h = String(now.getHours()).padStart(2, "0");
            const m = String(now.getMinutes()).padStart(2, "0");
            const s = String(now.getSeconds()).padStart(2, "0");
            setTime(`${h}:${m}:${s}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="wallpaper">
            {/* ⭐ 星 */}
            <div className="stars">
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="star"
                        style={{
                            "--x": Math.random(),
                            "--y": Math.random(),
                        }}
                    />
                ))}
            </div>

            {/* 🚀 ロケット（仮） */}
            <div className="rocket">🚀</div>

            {/* 右下UI */}
            <div className="bottom-ui">
                <div className="clock">{time}</div>

                <button className="icon-btn">📁</button>

                <button
                    className="icon-btn"
                    onClick={() => setShowSettings(true)}
                >
                    ⚙️
                </button>
            </div>

            {/* 設定モーダル（仮） */}
            {showSettings && (
                <div className="overlay">
                    <div className="settings-modal">
                        <h3>設定</h3>
                        <p>ここに設定UIが入る</p>
                        <button onClick={() => setShowSettings(false)}>閉じる</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallpaper;