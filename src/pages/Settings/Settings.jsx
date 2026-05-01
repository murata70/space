import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Wallpaper = () => {
    const navigate = useNavigate();

    // settings
    const [muted, setMuted] = useState(false);
    const [sec, setSec] = useState(true);
    const [is24h, setIs24h] = useState(false);
    const [tz, setTz] = useState("Asia/Tokyo");
    const [themeId, setThemeId] = useState("theme1");
    const [rocketColor, setRocketColor] = useState(0);

    // 保存処理
    const handleSave = () => {
        const settings = {
            muted,
            sec,
            is24h,
            tz,
            themeId,
            rocketColor,
        };

        localStorage.setItem("user_settings", JSON.stringify(settings));

        // 保存後：壁紙 or 設定どちらでもOK
        navigate("/wallpaper");
    };

    // 戻る（ホームなど）
    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="container">

            {/* 音量 */}
            <div className="row">
                <span>🔊</span>
                <input type="range" min="0" max="100" />
            </div>

            {/* ミュート */}
            <div className="row">
                <label>
                    <input
                        type="checkbox"
                        checked={muted}
                        onChange={(e) => setMuted(e.target.checked)}
                    />
                    ミュート
                </label>
            </div>

            {/* 秒表示 */}
            <div className="row">
                <span>秒表示</span>

                <label>
                    <input
                        type="radio"
                        name="sec"
                        checked={sec === true}
                        onChange={() => setSec(true)}
                    />
                    ON
                </label>

                <label>
                    <input
                        type="radio"
                        name="sec"
                        checked={sec === false}
                        onChange={() => setSec(false)}
                    />
                    OFF
                </label>
            </div>

            {/* タイムゾーン */}
            <select value={tz} onChange={(e) => setTz(e.target.value)}>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
            </select>

            {/* ロケット色 */}
            <select
                value={rocketColor}
                onChange={(e) => setRocketColor(Number(e.target.value))}
            >
                <option value={0}>赤</option>
                <option value={1}>青</option>
                <option value={2}>緑</option>
            </select>

            {/* 🟢 登録ボタン */}
            <div className="row">
                <button className="primaryBtn" onClick={handleSave}>
                    登録（保存）
                </button>
            </div>

            {/* 🔙 戻るボタン */}
            <div className="row">
                <button className="backBtn" onClick={handleBack}>
                    戻る
                </button>
            </div>

        </div>
    );
};

export default Wallpaper;