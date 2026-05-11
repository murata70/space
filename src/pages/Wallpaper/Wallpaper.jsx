import React from "react";
import { useNavigate } from "react-router-dom";

import "./Wallpaper.css";

import Clock from "../../components/ui/Clock/Clock";
import StarField from "../../components/ui/StarField/StarField";
//import FlowingAssets from "../../components/ui/FlowingAssets/FlowingAssets";
//import collectionData from "../../data/collection.json";

const Wallpaper = () => {

    const navigate = useNavigate();

    return (
        <div className="wallpaper">

            {/* 星背景 */}
            <StarField />
            {/*<FlowingAssets />*/}

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