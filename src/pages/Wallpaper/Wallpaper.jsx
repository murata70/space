// 修正中
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // (追加しました。村田)
import "./Wallpaper.css";

//テストです

const Wallpaper = () => {
    const [time, setTime] = useState("");
    const navigate = useNavigate();　// (追加しました。村田)
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

                <button
                    className="icon-btn"
                    onClick={() => navigate("/collection")} // (追加しました。村田 /collectionに接続するための変更)
                >
                    📁
                </button>

       
                <button
                    className="icon-btn"
                    onClick={() => navigate("/settings")} // (追加しました。村田 /settingsに接続するための変更)
                >
                    ⚙️
                </button>

            </div>

            {/*↓（非表示にしました。村田）*/}
            {/* 設定モーダル（仮）*/}
            {/*{showSettings && (*/}
            {/*    <div className="overlay">*/}
            {/*        <div className="settings-modal">*/}
            {/*            <h3>設定</h3>*/}
            {/*            <p>ここに設定UIが入る</p>*/}
            {/*            <button onClick={() => setShowSettings(false)}>閉じる</button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default Wallpaper;