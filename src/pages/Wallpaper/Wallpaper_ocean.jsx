import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper_ocean.css";

import Clock from "../../components/ui/Clock/Clock";

import BackGroundOcean from "../../components/ocean_ui/BackGround/BackGround";
import OceanBg from "../../components/ocean_ui/ocean_bg/ocean_bg";
import MainCar from "../../components/ocean_ui/main_car/main_car";

const WallpaperOcean = () => {
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        if (window.electron?.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false);
        }
    };

    const handleMouseLeave = () => {
        if (window.electron?.setIgnoreMouse) {
            window.electron.setIgnoreMouse(true);
        }
    };

    return (
        <div className="wallpaper-ocean">
            <BackGroundOcean />

            <OceanBg />

            <MainCar />

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

export default WallpaperOcean;