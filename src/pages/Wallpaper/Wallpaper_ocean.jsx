import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper_ocean.css";
import "../../styles/primary-monitor-ui.css";

import Clock from "../../components/ui/Clock/Clock";
import OceanBackgroundStage from "../../components/ocean_ui/OceanBackgroundStage";
import OceanFlowController from "../../components/ocean_ui/flows/OceanFlowController";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";

const OCEAN_PASSTHROUGH_SELECTORS = [".top-ui", ".main-car-position"];

const WallpaperOcean = () => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);

    useWallpaperMousePassthrough(
        { passthroughSelectors: OCEAN_PASSTHROUGH_SELECTORS },
        wallpaperRef
    );

    return (
        <div className="wallpaper-ocean" ref={wallpaperRef}>
            <OceanBackgroundStage showMainCar>
                <OceanFlowController />
            </OceanBackgroundStage>

            <div className="primary-monitor-ui">
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
    );
};

export default WallpaperOcean;
