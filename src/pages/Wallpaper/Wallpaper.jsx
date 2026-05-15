import React from "react";
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";
import Background from "../../components/ui/Background/Background";

const Wallpaper = () => {
    const navigate = useNavigate();

    return (
        <div className="wallpaper">
            {/* 背景画像コンポーネント */}
            <Background />

            <StarField />
            <Planets />
            <SpaceDust />
            <FlowController />
            <Rocket />

            <div className="bottom-ui">
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