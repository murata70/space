import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import StarField from "../../components/ui/StarField/StarField";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";

/* 共通設定パーツ */
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";
import {
    applyLaunchOnStartup,
    readLaunchOnStartupSetting,
} from "../../utils/launchOnStartup";

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
    const [sec, setSec] = useState(savedSettings?.sec ?? true);
    const [tz, setTz] = useState(savedSettings?.tz ?? "Asia/Tokyo");
    const [is24h, setIs24h] = useState(savedSettings?.is24h ?? true);
    const [launchOnStartup, setLaunchOnStartup] = useState(
        readLaunchOnStartupSetting(savedSettings)
    );
    const [exitDialogOpen, setExitDialogOpen] = useState(false);

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
    const handleStart = async () => {
        /* 保存 */
        const settings = {
            sec,
            tz,
            is24h,
            launchOnStartup,
        };

        try {
            localStorage.setItem("user_settings", JSON.stringify(settings));
            await applyLaunchOnStartup(launchOnStartup);
        } catch (e) {
            console.error("設定の保存に失敗しました", e);
        }

        navigate("/wallpaper");

        // 遷移完了後のタイミングでデスクトップ壁紙に動的設定
        setTimeout(() => {
            if (window.electron?.attachWallpaper) {
                window.electron.attachWallpaper();
            }
        }, 300);
    };

    const handleQuit = () => {
        if (typeof window.electron?.quitApp === "function") {
            window.electron.quitApp();
            return;
        }
        window.close();
    };

    return (
        <div className="home-wrapper">
            <button
                type="button"
                className="home-close-btn"
                aria-label="アプリケーションを終了"
                onClick={() => setExitDialogOpen(true)}
            >
                ×
            </button>

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
                        sec={sec}
                        setSec={setSec}
                        is24h={is24h}
                        setIs24h={setIs24h}
                        launchOnStartup={launchOnStartup}
                        setLaunchOnStartup={setLaunchOnStartup}
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

            <ThemeConfirmDialog
                open={exitDialogOpen}
                windowed
                message="アプリケーションを終了しますか？"
                confirmLabel="終了する"
                cancelLabel="キャンセル"
                onConfirm={handleQuit}
                onCancel={() => setExitDialogOpen(false)}
            />
        </div>
    );
};

export default Home;