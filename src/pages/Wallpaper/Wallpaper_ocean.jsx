import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper_ocean.css";

import Clock from "../../components/ui/Clock/Clock";

/* ===== 修正箇所：エラーの起きていた9行目のパスを実際のフォルダ名（小文字・ocaen）に一致させました ===== */
import BackGroundOcean from "../../components/ocean_ui/background_ocean/BackGround";
import OceanBg from "../../components/ocean_ui/ocean_bg/ocean_bg";
import MainCar from "../../components/ocean_ui/main_car/main_car";

const WallpaperOcean = () => {
    const navigate = useNavigate();

    // マウス透過解除

    const handleMouseEnter = () => {
        if (window.electron?.setIgnoreMouse) {
            window.electron.setIgnoreMouse(false);
        }
    };

    // マウス透過

    const handleMouseLeave = () => {
        if (window.electron?.setIgnoreMouse) {
            window.electron.setIgnoreMouse(true);
        }
    };

    return (
        <div className="wallpaper-ocean">
            {/* 背景 */}

            <BackGroundOcean />

            {/* 道路 */}

            <OceanBg />

            {/* メインカー */}

            <MainCar />

            {/* UI */}

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