import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
    const navigate = useNavigate();

    // 不要な変数は削除し、使うものだけに整理
    const [muted, setMuted] = useState(false);
    const [sec, setSec] = useState(true);
    const [tz, setTz] = useState("Asia/Tokyo");

    const handleSave = () => {
        const settings = { muted, sec, tz };
        localStorage.setItem("user_settings", JSON.stringify(settings));
        alert("設定を保存しました！");
        navigate("/wallpaper");
    };

    const handleBack = () => {
        if (window.confirm("保存せずに戻りますか？")) {
            navigate("/wallpaper");
        }
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <>
            <div className="shooting-star"></div>

            {/* 【修正箇所】CSSと名前を統一 */}
            <div className="settings-page-container">
                <h2 style={{ textAlign: "center", color: "#4fc3ff", marginBottom: "20px" }}>SETTINGS</h2>

                <div className="row">
                    <span>🔊 </span>
                    <input type="range" min="0" max="100" />
                </div>

                <div className="row">
                    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                            type="checkbox"
                            checked={muted}
                            onChange={(e) => setMuted(e.target.checked)}
                        />
                        ミュート
                    </label>
                </div>

                <div className="row">
                    <span>sec</span>
                    <div className="switch-group">
                        <label>
                            <input
                                type="radio"
                                name="sec"
                                checked={sec === true}
                                onChange={() => setSec(true)}
                            /> ON
                        </label>
                        <label style={{ marginLeft: "10px" }}>
                            <input
                                type="radio"
                                name="sec"
                                checked={sec === false}
                                onChange={() => setSec(false)}
                            /> OFF
                        </label>
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
                <div style={{ marginTop: "25px", display: "flex", flexDirection: "column", gap: "10px" }}>
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