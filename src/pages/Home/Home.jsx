import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import StarField from "../../components/ui/StarField/StarField";

/* 共通設定パーツ */
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";

const Home = () => {
    const navigate = useNavigate();

    /* 保存済み設定を取得 */
    let savedSettings = {};

    try {
        savedSettings =
            JSON.parse(localStorage.getItem("user_settings")) || {};
    } catch (error) {
        console.error("設定の読み込み失敗", error);
    }

    /* timezone防御 */
    if (savedSettings.tz === "Asia/Osaka") {
        savedSettings.tz = "Asia/Tokyo";
    }

    /* state */
    const [muted, setMuted] =
        useState(savedSettings.muted ?? false);

    const [volume, setVolume] =
        useState(savedSettings.volume ?? 50);

    const [sec, setSec] =
        useState(savedSettings.sec ?? true);

    const [tz, setTz] =
        useState(savedSettings.tz ?? "Asia/Tokyo");

    const [is24h, setIs24h] =
        useState(savedSettings.is24h ?? true);

    /* 初期設定：起動時は壁紙化しない（通常の操作ウィンドウ） */
    useEffect(() => {
        if (
            window.electron &&
            window.electron.setIgnoreMouse
        ) {
            window.electron.setIgnoreMouse(false);
        }
    }, []);

    /* Start */
    const handleStart = () => {
        /* 保存 */
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

        // 先にWallpaper画面へ遷移
        navigate("/wallpaper");

        // 遷移完了後のタイミングでデスクトップ壁紙に動的設定
        setTimeout(() => {
            if (
                window.electron &&
                window.electron.attachWallpaper
            ) {
                window.electron.attachWallpaper();
            }

            if (
                window.electron &&
                window.electron.setIgnoreMouse
            ) {
                window.electron.setIgnoreMouse(true);
            }
        }, 300);
    };

    return (
        <div className="home-wrapper">
 
            {/* 星空背景 */}
            <StarField />

            <div className="home-bg"></div>

            <div className="home-container">
                <h1 className="home-title">
                    SPACE WALLPAPER
                </h1>

                {/* 設定パーツ */}
                <div className="settings-box">
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
                </div>

                {/* Startボタン */}
                <button
                    className="ok-button"
                    onClick={handleStart}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default Home;