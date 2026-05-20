/* ===== Settings.jsx ===== */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css"
import StarField from "../../components/ui/StarField/StarField";
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";

const Settings = () => {
    const navigate = useNavigate();

    /* 保存済み設定を取得 */
        let savedSettings = {};

    try {
        savedSettings =
            JSON.parse(localStorage.getItem("user_settings")) || {};
    } catch (error) {
        console.error("設定の読み込み失敗", error);
    }
    /* 東京から大阪に自動変換 */
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

    const [volume, setVolume] = useState(
        savedSettings.volume ?? 50
    );

    /* 保存 */
    const handleSave = () => {
        const settings = {
            muted,
            volume,
            sec,
            tz,
            is24h
        };
        localStorage.setItem("user_settings", JSON.stringify(settings));
        alert("設定を保存しました！");
        navigate("/wallpaper");
    };
    //戻る(壁紙へ)
    const handleBack = () => {
        if (window.confirm("保存せずに戻りますか？")) {
            navigate("/wallpaper");
        }
    };
    //Homeに戻る
    const handleGoHome = () => {
        navigate("/");
    };
    /* 遊び部分 */
    const [isWarping, setIsWarping] = useState(false);
    const handleTitleClick = () => {
        setIsWarping(true);
        // 1秒後にアニメーション状態を解除
        setTimeout(() => setIsWarping(false), 1000);
    };

    return (
        <>
            <StarField />

            {/* 遊び部分 */}
            {/* 【修正箇所】CSSと名前を統一 */}
            <div className="settings-page-container space-theme">
                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                    onClick={handleTitleClick}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
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

                {/* ボタン群の配置を整理 */}
                <div className="button-group">
                    <button className="settings-btn primaryBtn" onClick={handleSave}>
                        登録（保存）
                    </button>
                    <button className="settings-btn backBtn" onClick={handleBack}>
                        ← 壁紙へ戻る🚀
                    </button>
                    <button className="settings-btn homeBtn" onClick={handleGoHome}>
                        🏠 ホームへ
                    </button>

                    {/*<button*/}
                    {/*    className="settings-btn oceanBtn"*/}
                    {/*    onClick={() => navigate("/settings_ocean")}*/}
                    {/*>*/}
                    {/*    🌊 OCEAN SETTINGSへ*/}
                    {/*</button>*/}

                </div>

            </div>
        </>
    );
};

export default Settings;