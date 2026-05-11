import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";

//惑星インポート
import Planets from "../../components/ui/Planets/Planets";

//ロケットインポート
import Rocket from "../../components/ui/Rocket/Rocket";


const Wallpaper = () => {

    const navigate = useNavigate();

    return (
        <div className="wallpaper">

            {/* 星背景 */}
            <StarField />

            {/* 惑星 */}
            <Planets />

            {/* ロケット */}
            <Rocket />

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