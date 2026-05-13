/* ===== Settings.jsx ===== */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css"
import StarField from "../../components/ui/StarField/StarField";
import SettingsPart from "../../components/ui/SettingsPart/SettingsPart";

const Settings = () => {
    const navigate = useNavigate();

    /* state */
    const [muted, setMuted] = useState(false);
    const [sec, setSec] = useState(true);
    const [tz, setTz] = useState("Asia/Tokyo");
    const [is24h, setIs24h] = useState(true);

    /* 保存 */
    const handleSave = () => {
        const settings = { muted, sec, tz, is24h };
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
            <div className="settings-page-container">
                <h2
                    className={`settings-title ${isWarping ? "warp-mode" : ""}`}
                    onClick={handleTitleClick}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                    SETTINGS
                </h2>

                <SettingsPart
                    muted={muted}
                    setMuted={setMuted}
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
                        ← 壁紙へ戻る
                    </button>
                    <button className="settings-btn homeBtn" onClick={handleGoHome}>
                        🏠 ホームへ
                    </button>
                </div>

            </div>
        </>
    );
};

export default Settings;