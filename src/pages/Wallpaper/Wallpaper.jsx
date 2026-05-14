import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";

const Wallpaper = () => {

    const navigate = useNavigate();

    return (
        <div
            className="wallpaper"
            style={{
                "--bg-16x9": "url('/assets/image/BackGround/background_16x9.png')",
                "--bg-4x3": "url('/assets/image/BackGround/background_4x3.png')",
            }}
        >

            <StarField />

            <Planets />

            <SpaceDust />

            {/* ここが差し替え */}
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