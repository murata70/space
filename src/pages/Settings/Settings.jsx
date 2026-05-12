/* ===== Settings.jsx ===== */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import StarField from "../../components/ui/StarField/StarField";

const Settings = () => {
    const navigate = useNavigate();

    // 不要な変数は削除し、使うものだけに整理
    const [muted, setMuted] = useState(false);
    const [sec, setSec] = useState(true);
    const [tz, setTz] = useState("Asia/Tokyo");
    const [is24h, setIs24h] = useState(true);

    const handleSave = () => {
        const settings = { muted, sec, tz, is24h };
        localStorage.setItem("user_settings", JSON.stringify(settings));
        alert("設定を保存しました！");
        navigate("/wallpaper");
    };

    //戻る(壁紙へ)
    const handleBack = () => {
        if (window.confirm("保存せずに戻りますか？")) {
            navigate("/wallpaper");
        }
    };

    //Homeに戻る
    const handleGoHome = () => {
        navigate("/");
    };

    /* 遊び部分 */
    const [isWarping, setIsWarping] = useState(false);

    const handleTitleClick = () => {
        setIsWarping(true);
        // 1秒後にアニメーション状態を解除
        setTimeout(() => setIsWarping(false), 1000);
    };

    return (
        <>
            <StarField />
            <div className="shooting-star"></div>

            /* 遊び部分 */
            {/* 【修正箇所】CSSと名前を統一 */}
            <div className="settings-page-container">
                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                    onClick={handleTitleClick}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    SETTINGS
                </h2>

                {/* 各行設定 */}
                <div className="row">
                    <button
                        className="muteBtn"
                        onClick={() => setMuted(!muted)}
                    >
                        {muted ? "🔇" : "🔊"}
                    </button>
                    <input type="range" min="0" max="100" />
                </div>

                <div className="row">
                    <span>sec</span>

                    <div className="text-toggle">
                        <button
                            className={sec ? "text-btn active" : "text-btn"}
                            onClick={() => setSec(true)}
                        >
                            ON
                        </button>

                        <button
                            className={!sec ? "text-btn active" : "text-btn"}
                            onClick={() => setSec(false)}
                        >
                            OFF
                        </button>
                    </div>
                </div>
              {/* 24時間表示 */}
                <div className="row">
                    <span>24h</span>

                    <div className="text-toggle">
                        <button
                            className={is24h ? "text-btn active" : "text-btn"}
                            onClick={() => setIs24h(true)}
                        >
                            ON
                        </button>

                        <button
                            className={!is24h ? "text-btn active" : "text-btn"}
                            onClick={() => setIs24h(false)}
                        >
                            OFF
                        </button>
                    </div>
                </div>
                <div className="row" style={{ display: "block" }}>
                    <span style={{ display: "block", marginBottom: "5px" }}>タイムゾーン</span>
                    <select value={tz} onChange={(e) => setTz(e.target.value)}>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">New York</option>
                        <option value="Europe/London">London</option>
                    </select>
                </div>

                



                {/* ボタン群の配置を整理 */}
                <div className = "button-group">
                <button className="primaryBtn" onClick={handleSave}>
                    登録（保存）
                </button>
                <button className="backBtn" onClick={handleBack}>
                    ← 壁紙へ戻る
                </button>
                <button className="homeBtn" onClick={handleGoHome}>
                    🏠 ホームへ
                </button>
            </div>
            </div>
        </>
    );
};

export default Settings;