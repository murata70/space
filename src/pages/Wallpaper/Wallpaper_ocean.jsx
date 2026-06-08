import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper_ocean.css";
import "../../styles/primary-monitor-ui.css";

import Clock from "../../components/ui/Clock/Clock";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";

const OCEAN_PASSTHROUGH_SELECTORS = [".top-ui", ".main-car-position"];
const OCEAN_UI_HOVER_SELECTORS = [".top-ui"];

const WallpaperOcean = () => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);

    const { isUiLayerHovered } = useWallpaperMousePassthrough(
        {
            passthroughSelectors: OCEAN_PASSTHROUGH_SELECTORS,
            uiLayerHoveredSelectors: OCEAN_UI_HOVER_SELECTORS,
        },
        wallpaperRef
    );

    return (
        <div className="wallpaper-ocean" ref={wallpaperRef}>
            <div className="primary-monitor-ui">
                <div
                    className={`wallpaper-ui-layer ${isUiLayerHovered ? "hovered" : ""}`}
                >
                    <div className="top-ui">
                        <Clock />

                        <div className="top-ui-actions">
                            <button
                                className="icon-btn"
                                onClick={() => navigate("/collection_ocean")}
                            >
                                📁
                            </button>

                            <button
                                className="icon-btn"
                                onClick={() => navigate("/settings_ocean")}
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

export default WallpaperOcean;