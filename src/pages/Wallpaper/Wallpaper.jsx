import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";
import BackGround from "../../components/ui/background_space/BackGround";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";

const WALLPAPER_INTERACTIVE_SELECTORS = [".top-ui", ".rocket-position"];

const Wallpaper = () => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);
    const isHovered = useWallpaperMousePassthrough(
        WALLPAPER_INTERACTIVE_SELECTORS,
        wallpaperRef
    );

    return (
        <div className="wallpaper" ref={wallpaperRef}>
            <BackGround />

            <StarField />
            <Planets />
            <SpaceDust />
            <FlowController />
            <Rocket />

            <div
                className={`wallpaper-ui-layer ${isHovered ? "hovered" : ""}`}
            >
                <div className="top-ui">
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
