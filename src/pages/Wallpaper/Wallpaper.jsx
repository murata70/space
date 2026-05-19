import React from "react";
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

    // UIエリアに入った時はクリックできるようにする
    const handleMouseEnter = () => {
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false);
        }
    };

    // UIエリアから出た時は背後のアイコン等に触れるよう透過する
    const handleMouseLeave = () => {
        if (window.electron && window.electron.setIgnoreMouse) {
            window.electron.setIgnoreMouse(true);
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

            <div
                className="bottom-ui"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Clock />
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
    );
};

export default Wallpaper;
