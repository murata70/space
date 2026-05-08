import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";

const Wallpaper = () => {

    const navigate = useNavigate();

    return (
        <div className="wallpaper">

            {/* 星背景 */}
            <StarField />

            {/* ロケット */}
            <div className="rocket">
                🚀
            </div>

            {/* UI */}
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