import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Settings_ocean.css";
import "../../components/ui/SettingsPart/SettingsPart_ocean.css";

import SettingsPart_ocean from "../../components/ui/SettingsPart/SettingsPart_ocean";

const Settings_ocean = () => {
    const navigate = useNavigate();

    let savedSettings = {};

    try {
        savedSettings =
            JSON.parse(localStorage.getItem("user_settings")) || {};
    } catch (error) {
        console.error("設定の読み込み失敗", error);
    }

    if (savedSettings.tz === "Asia/Osaka") {
        savedSettings.tz = "Asia/Tokyo";
    }

    const [muted, setMuted] = useState(savedSettings.muted ?? false);
    const [sec, setSec] = useState(savedSettings.sec ?? true);
    const [tz, setTz] = useState(savedSettings.tz ?? "Asia/Tokyo");
    const [is24h, setIs24h] = useState(savedSettings.is24h ?? true);
    const [volume, setVolume] = useState(savedSettings.volume ?? 50);

    const [isWarping, setIsWarping] = useState(false);

    const handleSave = () => {
        const settings = { muted, volume, sec, tz, is24h };

        localStorage.setItem("user_settings", JSON.stringify(settings));

        alert("設定を保存しました！");
        navigate("/wallpaper_ocean");
    };

    const handleBack = () => {
        if (window.confirm("保存せずに戻りますか？")) {
            navigate("/wallpaper_ocean");
        }
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className="settings-page-container ocean-theme">

            <h2
                className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                onClick={() => {
                    setIsWarping(true);
                    setTimeout(() => setIsWarping(false), 3000);
                }}
            >
                OCEAN SETTINGS
            </h2>

            <SettingsPart_ocean
                muted={muted}
                setMuted={setMuted}
                volume={volume}
                setVolume={setVolume}
                sec={sec}
                setSec={setSec}
                is24h={is24h}
                setIs24h={setIs24h}
                tz={tz}
                setTz={setTz}
            />

            <div className="button-group">
                <button className="settings-btn primaryBtn" onClick={handleSave}>
                    登録（保存）
                </button>

                <button className="settings-btn backBtn" onClick={handleBack}>
                    ← 壁紙へ戻る🌊
                </button>

                <button className="settings-btn homeBtn" onClick={handleGoHome}>
                    🏠 ホームへ
                </button>

                <button
                    className="settings-btn debugBtn"
                    onClick={() => navigate("/settings")}
                >
                    🌌 宇宙Settingsへ（デバッグ）
                </button>

            </div>

        </div>
    );
};

export default Settings_ocean;