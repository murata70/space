/* ===== Settings_ocean.jsx ===== */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Settings_ocean.css";
import "../../components/ui/SettingsPart/SettingPart_ocean.css";

import StarField from "../../components/ui/StarField/StarField";
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";

const Settings_ocean = () => {
    const navigate = useNavigate();

    /* 保存済み設定 */
    let savedSettings = {};

    try {
        savedSettings =
            JSON.parse(localStorage.getItem("user_settings")) || {};
    } catch (error) {
        console.error("設定の読み込み失敗", error);
    }

    /* 大阪 → 東京変換 */
    if (savedSettings.tz === "Asia/Osaka") {
        savedSettings.tz = "Asia/Tokyo";
    }

    /* state */
    const [muted, setMuted] =
        useState(savedSettings.muted ?? false);

    const [sec, setSec] =
        useState(savedSettings.sec ?? true);

    const [tz, setTz] =
        useState(savedSettings.tz ?? "Asia/Tokyo");

    const [is24h, setIs24h] =
        useState(savedSettings.is24h ?? true);

    const [volume, setVolume] =
        useState(savedSettings.volume ?? 50);

    /* 保存 */
    const handleSave = () => {
        const settings = {
            muted,
            volume,
            sec,
            tz,
            is24h
        };

        localStorage.setItem(
            "user_settings",
            JSON.stringify(settings)
        );

        alert("設定を保存しました！");
        navigate("/wallpaper_ocean");
    };

    /* 戻る */
    const handleBack = () => {
        if (window.confirm("保存せずに戻りますか？")) {
            navigate("/wallpaper_ocean");
        }
    };

    /* Homeへ */
    const handleGoHome = () => {
        navigate("/");
    };

    /* 遊び部分 */
    const [isWarping, setIsWarping] =
        useState(false);

    const handleTitleClick = () => {
        setIsWarping(true);

        setTimeout(() => {
            setIsWarping(false);
        }, 3000);
    };

    return (
        <>
            {/* <StarField /> */}

            <div className="settings-page-container">

                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""
                        }`}
                    onClick={handleTitleClick}
                    style={{
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                >
                    OCEAN SETTINGS
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
                        ← 壁紙へ戻る🌊
                    </button>

                    <button
                        className="settings-btn homeBtn"
                        onClick={handleGoHome}
                    >
                        🏠 ホームへ
                    </button>

                </div>
            </div>
        </>
    );
};

export default Settings_ocean;