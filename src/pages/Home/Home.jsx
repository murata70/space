import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import StarField from "../../components/ui/StarField/StarField";

/* 共通設定パーツ */
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";

const Home = () => {
    const navigate = useNavigate();

    /* 安全にlocalStorageから設定を取得（不整合対策） */
    let savedSettings = {};
    try {
        const rawData = localStorage.getItem("user_settings");
        if (rawData) {
            savedSettings = JSON.parse(rawData) || {};
        }
    } catch (error) {
        console.error("設定の読み込み失敗", error);
    }

    /* timezone防御 */
    if (savedSettings && savedSettings.tz === "Asia/Osaka") {
        savedSettings.tz = "Asia/Tokyo";
    }

    /* state 初期値の安全なフォールバック */
    const [muted, setMuted] = useState(savedSettings?.muted ?? false);
    const [volume, setVolume] = useState(savedSettings?.volume ?? 50);
    const [sec, setSec] = useState(savedSettings?.sec ?? true);
    const [tz, setTz] = useState(savedSettings?.tz ?? "Asia/Tokyo");
    const [is24h, setIs24h] = useState(savedSettings?.is24h ?? true);

    /* 初期設定：起動時は壁紙化しない（通常の操作ウィンドウ） */
    useEffect(() => {
        if (
            window.electron &&
            typeof window.electron.setIgnoreMouse === "function"
        ) {
            // 描画のバグを防ぐため、わずかに遅延させて透過を解除
            const timer = setTimeout(() => {
                window.electron.setIgnoreMouse(false);
            }, 50);
            return () => clearTimeout(timer);
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

        try {
            localStorage.setItem("user_settings", JSON.stringify(settings));
        } catch (e) {
            console.error("設定の保存に失敗しました", e);
        }

        // 【修正】Electron(HashRouter)環境下での確実なルーティングのため、相対パス指定に変更
        navigate("/wallpaper");

        // 遷移完了後のタイミングでデスクトップ壁紙に動的設定
        setTimeout(() => {
            if (window.electron?.attachWallpaper) {
                window.electron.attachWallpaper();
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