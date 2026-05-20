import React, { useState } from "react"; // 【修正】useState を追加
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";
import BackGround from "../../components/ui/background_space/BackGround";

const Wallpaper = () => {
    const navigate = useNavigate();
    // 【修正】マウスがUIエリアに乗っているかを管理する状態
    const [isHovered, setIsHovered] = useState(false);

    // UIエリア（時計やボタンの塊）に入った時
    const handleMouseEnter = () => {
        setIsHovered(true);
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false); // マウス透過解除（Electron側）
        }
    };

    // UIエリアから出た時
    const handleMouseLeave = () => {
        setIsHovered(false);
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(true); // マウス透過（Electron側）
        }
    };

    return (
        <div className="wallpaper">
            {/* 背景画像コンポーネント */}
            <BackGround />

            <StarField />
            <Planets />
            <SpaceDust />
            <FlowController />
            <Rocket />

            {/* 【修正】画面全体を覆うインタラクション用のレイヤーを追加。
              hoveredクラスによって、css側で全体のpointer-eventsを切り替えます。
            */}
            <div className={`wallpaper-ui-layer ${isHovered ? "hovered" : ""}`}>
                <div
                    className="top-ui"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Clock />

                    <div className="top-ui-actions">
                        <button
                            className="icon-btn"
                            onClick={() => navigate("/collection")}
                        >
                            📁
                        </button>
                        <button
                            className="icon-btn"
                            onClick={() => navigate("/settings")}
                        >
                            ⚙️
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallpaper;