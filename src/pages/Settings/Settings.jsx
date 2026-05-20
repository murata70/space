/* ===== Settings.jsx ===== */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";

const SETTINGS_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".settings-page-container",
];

const Settings = () => {
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

    const handleTitleClick = () => {
        setIsWarping(true);
        setTimeout(() => setIsWarping(false), 1000);
    };

    return (
        <AppFloatingWindow passthroughSelectors={SETTINGS_PASSTHROUGH}>
            <div className="settings-page-container space-theme">
                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                    onClick={handleTitleClick}
                    style={{ cursor: "pointer", userSelect: "none" }}
                >
                    SPACE SETTINGS
                </h2>

                <SettingsPart
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
                    <button
                        className="settings-btn primaryBtn"
                        onClick={handleSave}
                    >
                        登録（保存）
                    </button>
                    <button
                        className="settings-btn backBtn"
                        onClick={handleBack}
                    >
                        ← 壁紙へ戻る🚀
                    </button>
                    <button
                        className="settings-btn homeBtn"
                        onClick={handleGoHome}
                    >
                        🏠 ホームへ
                    </button>
                </div>
            </div>
        </AppFloatingWindow>
    );
};

export default Settings;
