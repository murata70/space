import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Settings_ocean.css";
import "../../components/ui/SettingsPart/SettingsPart_ocean.css";

import SettingsPart_ocean from "../../components/ui/SettingsPart/SettingsPart_ocean";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";

const SETTINGS_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".settings-page-container",
    ".settings-page-wrapper",
    ".theme-confirm-overlay",
    ".theme-confirm-dialog",
    ".theme-confirm-btn",
    ".theme-confirm-close",
];

const Settings_ocean = () => {
    const navigate = useNavigate();

    let savedSettings = {};
    try {
        savedSettings = JSON.parse(localStorage.getItem("user_settings")) || {};
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
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [backDialogOpen, setBackDialogOpen] = useState(false);
    const [homeDialogOpen, setHomeDialogOpen] = useState(false);

    const persistSettings = () => {
        const settings = { muted, volume, sec, tz, is24h };
        localStorage.setItem("user_settings", JSON.stringify(settings));
    };

    const handleSave = () => {
        persistSettings();
        setSaveDialogOpen(true);
    };

    const closeSettings = useCallback(() => {
        setSaveDialogOpen(false);
        setBackDialogOpen(false);
        setHomeDialogOpen(false);
        navigate("/wallpaper_ocean", { replace: true });
        if (!window.location.hash.includes("/wallpaper_ocean")) {
            window.location.hash = "#/wallpaper_ocean";
        }
    }, [navigate]);

    const handleSaveDialogClose = () => {
        closeSettings();
    };

    const handleBack = () => {
        setBackDialogOpen(true);
    };

    const handleBackConfirm = () => {
        setBackDialogOpen(false);
        navigate("/wallpaper_ocean", { replace: true });
    };

    const handleGoHome = () => {
        setHomeDialogOpen(true);
    };

    const handleHomeSaveAndGo = () => {
        persistSettings();
        setHomeDialogOpen(false);
        navigate("/");
    };

    const handleHomeGoWithoutSave = () => {
        setHomeDialogOpen(false);
        navigate("/");
    };

    return (
        <AppFloatingWindow
            passthroughSelectors={SETTINGS_PASSTHROUGH}
            onDismiss={closeSettings}
        >
            <div className="settings-page-wrapper ocean-theme">
                <div className="bubble-layer">
                    {[...Array(25)].map((_, i) => (
                        <span
                            key={i}
                            className="bubble"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${6 + Math.random() * 8}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                width: `${10 + Math.random() * 25}px`,
                                height: `${10 + Math.random() * 25}px`,
                            }}
                        />
                    ))}
                </div>

                <div className="settings-page-container ocean-theme">
                    <h2
                        className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                        onClick={() => {
                            setIsWarping(true);
                            setTimeout(() => setIsWarping(false), 5000);
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
            </div>

            <ThemeConfirmDialog
                open={saveDialogOpen}
                message="設定を保存しました！"
                showCancel={false}
                onConfirm={handleSaveDialogClose}
                onCancel={handleSaveDialogClose}
            />

            <ThemeConfirmDialog
                open={backDialogOpen}
                message="保存せずに戻りますか？"
                confirmLabel="戻る"
                cancelLabel="キャンセル"
                onConfirm={handleBackConfirm}
                onCancel={() => setBackDialogOpen(false)}
            />

            <ThemeConfirmDialog
                open={homeDialogOpen}
                message="保存しますか？"
                confirmLabel="OK"
                cancelLabel="キャンセル"
                onConfirm={handleHomeSaveAndGo}
                onCancel={handleHomeGoWithoutSave}
            />
        </AppFloatingWindow>
    );
};

export default Settings_ocean;
