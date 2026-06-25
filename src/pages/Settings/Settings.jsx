/* ===== Settings.jsx ===== */
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";
import AppFloatingWindow from "../../components/layout/AppFloatingWindow";
import ThemeConfirmDialog from "../../components/ui/ThemeConfirmDialog/ThemeConfirmDialog";
import {
    applyLaunchOnStartup,
    readLaunchOnStartupSetting,
} from "../../utils/launchOnStartup";

const SETTINGS_PASSTHROUGH = [
    ".app-floating-window",
    ".app-floating-shell",
    ".settings-page-container",
    ".theme-confirm-overlay",
    ".theme-confirm-dialog",
    ".theme-confirm-btn",
    ".theme-confirm-close",
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

    const [sec, setSec] = useState(savedSettings.sec ?? true);
    const [tz, setTz] = useState(savedSettings.tz ?? "Asia/Tokyo");
    const [is24h, setIs24h] = useState(savedSettings.is24h ?? true);
    const [launchOnStartup, setLaunchOnStartup] = useState(
        readLaunchOnStartupSetting(savedSettings)
    );
    const [isWarping, setIsWarping] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [homeDialogOpen, setHomeDialogOpen] = useState(false);

    const persistSettings = async () => {
        const settings = { sec, tz, is24h, launchOnStartup };
        localStorage.setItem("user_settings", JSON.stringify(settings));
        await applyLaunchOnStartup(launchOnStartup);
    };

    const handleSave = async () => {
        await persistSettings();
        setSaveDialogOpen(true);
    };

    const closeSettings = useCallback(() => {
        setSaveDialogOpen(false);
        setHomeDialogOpen(false);
        navigate("/wallpaper", { replace: true });
        if (!window.location.hash.includes("/wallpaper")) {
            window.location.hash = "#/wallpaper";
        }
    }, [navigate]);

    const handleSaveDialogClose = () => {
        closeSettings();
    };

    const handleGoHome = () => {
        setHomeDialogOpen(true);
    };

    const handleHomeSaveAndGo = async () => {
        await persistSettings();
        setHomeDialogOpen(false);
        navigate("/");
    };

    const handleHomeGoWithoutSave = () => {
        setHomeDialogOpen(false);
        navigate("/");
    };

    const handleTitleClick = () => {
        setIsWarping(true);
        setTimeout(() => setIsWarping(false), 1000);
    };

    return (
        <AppFloatingWindow
            passthroughSelectors={SETTINGS_PASSTHROUGH}
            onDismiss={closeSettings}
        >
            <div className="settings-page-container space-theme">
                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                    onClick={handleTitleClick}
                    style={{ cursor: "pointer", userSelect: "none" }}
                >
                    SPACE SETTINGS
                </h2>

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

                <div className="button-group">
                    <button
                        className="settings-btn primaryBtn"
                        onClick={handleSave}
                    >
                        保存
                    </button>
                    <button
                        className="settings-btn homeBtn"
                        onClick={handleGoHome}
                    >
                        🏠 ホームへ
                    </button>
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

export default Settings;
