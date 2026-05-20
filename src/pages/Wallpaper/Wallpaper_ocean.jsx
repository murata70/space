import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper_ocean.css";

import Clock from "../../components/ui/Clock/Clock";
import BackGroundOcean from "../../components/ocean_ui/background_ocean/BackGround";
import OceanBg from "../../components/ocean_ui/ocean_bg/ocean_bg";
import MainCar from "../../components/ocean_ui/main_car/main_car";
import OceanFlowController from "../../components/ocean_ui/flows/OceanFlowController";
import { useWallpaperMousePassthrough } from "../../hooks/useWallpaperMousePassthrough";

const OCEAN_INTERACTIVE_SELECTORS = [".top-ui", ".main-car-position"];

const WallpaperOcean = ({ baseUrl }) => {
    const navigate = useNavigate();
    const wallpaperRef = useRef(null);

    useWallpaperMousePassthrough(OCEAN_INTERACTIVE_SELECTORS, wallpaperRef);

    return (
        <div className="wallpaper-ocean" ref={wallpaperRef}>
            <BackGroundOcean baseUrl={baseUrl} />

            <OceanBg baseUrl={baseUrl} />

            <MainCar baseUrl={baseUrl} />

            <OceanFlowController />

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
    );
};

export default WallpaperOcean;
