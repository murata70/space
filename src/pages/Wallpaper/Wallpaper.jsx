import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Wallpaper.css";
import "../../styles/primary-monitor-ui.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
import Planets from "../../components/ui/Planets/Planets";
import Rocket from "../../components/ui/Rocket/Rocket";
import FlowController from "../../components/ui/flows/FlowController";
import SpaceDust from "../../components/ui/SpaceDust/SpaceDust";
import BackGround from "../../components/ui/background_space/BackGround";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";
import { usePrimaryDisplayLayout } from "../../hooks/usePrimaryDisplayLayout";

const WALLPAPER_PASSTHROUGH_SELECTORS = [
    ".top-ui",
    ".rocket-position",
    ".rocket-wrapper",
];
const WALLPAPER_UI_HOVER_SELECTORS = [".top-ui"];

const Wallpaper = () => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);
    usePrimaryDisplayLayout(wallpaperRef);
    const { isUiLayerHovered } = useWallpaperMousePassthrough(
        {
            passthroughSelectors: WALLPAPER_PASSTHROUGH_SELECTORS,
            uiLayerHoveredSelectors: WALLPAPER_UI_HOVER_SELECTORS,
        },
        wallpaperRef
    );

    return (
        <div className="wallpaper" ref={wallpaperRef}>
            <BackGround />

            <StarField />
            <Planets />
            <SpaceDust />
            <FlowController />

            <div className="primary-monitor-ui">
                <Rocket />

                <div
                    className={`wallpaper-ui-layer ${isUiLayerHovered ? "hovered" : ""}`}
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
        </div>
    );
};

export default Wallpaper;
